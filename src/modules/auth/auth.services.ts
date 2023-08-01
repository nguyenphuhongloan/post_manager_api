import jwt from "jsonwebtoken";
import { Inject, Service } from "typedi";
import { Config, configToken } from "../../config/configENV";
import { RefreshTokenInRedis } from "./token.redis.service";
import { Request } from "express";

export interface AuthRequest extends Request {
    userId?: number;
    refreshToken?: RefreshTokenInRedis;
}

export interface OTPRequest extends Request {
    userId?: number;
    email?: string;
    otp: number;
}

export interface BodyRequest<T> extends Request {
    userId?: number;
    refreshToken?: RefreshTokenInRedis;
    body: T;
}

export class AuthPayload {
    userId: number;

    constructor(userId: number) {
        this.userId = userId;
    }

    static createAuthPayloadObject = (userId: number): Object => {
        return {
            userId: userId,
        }
    }
}
@Service()
export class AuthService {
    @Inject(configToken)
    private readonly config!: Config;
    private readonly expireTimeAccessToken = 5 * 60;
    private readonly expireTimeRefeshToken = 15 * 60;

    createAccessToken(payload: AuthPayload) {
        return jwt.sign(payload, this.config.SECRET_ACCESS_TOKEN, { expiresIn: this.expireTimeAccessToken });
    }

    createRefreshToken(payload: AuthPayload) {
        const data = jwt.sign(payload, this.config.SECRET_REFRESH_TOKEN, { expiresIn: this.expireTimeRefeshToken });
        return data;
    }
}