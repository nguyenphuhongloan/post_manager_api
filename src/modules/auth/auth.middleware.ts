import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Err } from "../../helpers/error";
import { Config, configToken } from "../../config/configENV";
import { Inject, Service } from "typedi";
import { TokenRedisService } from "./token.redis.service";
import { AuthPayload, AuthRequest, BodyRequest } from "./auth.services";
import { UserLogout } from "../users/dto/user-logout.dto";
import { plainToInstance } from "class-transformer";
import { UserService } from "../users/user.service";
@Service()
export class AuthMiddleware {
    private readonly prefixHeader = "Bearer";

    @Inject(configToken)
    private readonly config!: Config;

    @Inject()
    private readonly userService!: UserService;

    @Inject()
    private readonly tokenRedisService!: TokenRedisService;



    getBearerToken = (req: Request) => {
        if (!req.headers.authorization)
            throw Err.InvalidToken;
        const header: string[] = req.headers.authorization.split(" ");
        if (header[0] != this.prefixHeader)
            throw Err.InvalidToken;
        return header[1];
    }

    verifyAccessToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const token = this.getBearerToken(req);
            const decodedToken = jwt.verify(token, this.config.SECRET_ACCESS_TOKEN, (err, decodedToken) => {
                if (err)
                    throw Err.InvalidToken;
                return decodedToken;
            });
            const authPayload = decodedToken as unknown as AuthPayload;
            await this.tokenRedisService.checkAccessTokenInRedis(authPayload.userId, token);
            req.userId = authPayload.userId;
            return next();
        } catch (error) {
            return next(error)
        }
    }

    verifyRefreshToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const token = this.getBearerToken(req);
            const decodedToken = jwt.verify(token, this.config.SECRET_REFRESH_TOKEN, (err, decodedToken) => {
                if (err)
                    throw Err.InvalidToken;
                return decodedToken;
            })
            const authPayload = decodedToken as unknown as AuthPayload;
            const refreshToken = await this.tokenRedisService.checkRefreshTokenInRedis(authPayload.userId, token);
            req.userId = authPayload.userId;
            req.refreshToken = refreshToken;
            next();
        } catch (error) {
            next(error)
        }
    }

    verifyRefreshTokenLogout = async (req: BodyRequest<UserLogout>, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.body.refreshToken;
            const decodedToken = jwt.verify(refreshToken, this.config.SECRET_REFRESH_TOKEN, (err, decodeToken) => {
                if (err)
                    throw Err.InvalidToken;
                return decodeToken;
            });
            const authPayload: AuthPayload = plainToInstance(AuthPayload, decodedToken);
            const tokenInRedis = await this.tokenRedisService.checkRefreshTokenInRedis(authPayload.userId, refreshToken);
            if (!tokenInRedis)
                throw Err.InvalidToken;
            const accessToken = this.getBearerToken(req);
            if (tokenInRedis.refToken != accessToken)
                throw Err.InvalidToken;
            req.refreshToken = tokenInRedis;
            req.userId = authPayload.userId;
            next()
        } catch (error) {
            next(error)
        }
    }

    verifyPermissionsAdminOrModerator = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.userId)
                throw Err.InvalidToken;
            await this.userService.isAdminOrModerator(req.userId);
            next();
        } catch (error) {
            next(error)
        }
    }
}