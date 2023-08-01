import { plainToInstance } from 'class-transformer';
import { Inject, Service } from 'typedi';
import { Err } from '../../helpers/error';
import { Redis } from '../redis/redis.services';

@Service()
export class AccessTokenInRedis {
    token: string;
    ex: number;

    constructor(token: string, ex: number) {
        this.token = token;
        this.ex = ex;
    }

    static convertToArray = (data: string) => {
        const lstToken = JSON.parse(data);
        const tokens = plainToInstance(AccessTokenInRedis, lstToken);
        return tokens ?? [];
    }
}

export class RefreshTokenInRedis extends AccessTokenInRedis {
    refToken: string;
    constructor(token: string, ex: number, refToken: string) {
        super(token, ex);
        this.refToken = refToken;
    }

    static convertToArray = (data: string) => {
        const lstToken = JSON.parse(data);
        const tokens = plainToInstance(RefreshTokenInRedis, lstToken);
        return tokens ?? [];
    }
}

@Service()
export class TokenRedisService {
    @Inject()
    private readonly redis!: Redis;
    private readonly keyAccessToken = "AccessToken";
    private readonly keyRefreshToken = "RefreshToken";

    private readonly exAccessToken: number = 300 * 1000;
    private readonly exRefreshToken: number = 1500 * 1000;

    timeExpiredAccessToken = (): number => {
        return Date.now() + this.exAccessToken;
    }

    timeExpiredRefeshToken = (): number => {
        return Date.now() + this.exRefreshToken;
    }

    hsetAccessToken = async (userId: number, token: string) => {
        await this.redis.hSetField(this.keyAccessToken, userId, token);
    }

    hsetRefreshToken = async (userId: number, token: string) => {
        await this.redis.hSetField(this.keyRefreshToken, userId, token);
    }

    saveToken = async (userId: number, accessToken: string, refreshToken: string) => {
        const exTimeAccessToken = this.timeExpiredAccessToken();
        const lstAccessToken = await this.getAllAccessTokens(userId);
        const newAccessToken = new AccessTokenInRedis(accessToken, exTimeAccessToken);
        lstAccessToken.push(newAccessToken);
        await this.hsetAccessToken(userId, JSON.stringify(lstAccessToken));

        const exTimeRefeshToken = this.timeExpiredAccessToken();
        const lstRefreshToken = await this.getAllRefreshTokens(userId);
        const newRefreshToken = new RefreshTokenInRedis(refreshToken, exTimeRefeshToken, newAccessToken.token);
        lstRefreshToken.push(newRefreshToken);
        await this.hsetRefreshToken(userId, JSON.stringify(lstRefreshToken));
    }

    getAllAccessTokens = async (userId: number): Promise<AccessTokenInRedis[]> => {
        const strListAccessToken = await this.redis.hGetField(this.keyAccessToken, userId.toString());
        const lstAccessToken = RefreshTokenInRedis.convertToArray(strListAccessToken!);
        return lstAccessToken;
    }

    getAllRefreshTokens = async (userId: number): Promise<AccessTokenInRedis[]> => {
        const strListRefreshToken = await this.redis.hGetField(this.keyRefreshToken, userId.toString());
        const lstRefreshToken = RefreshTokenInRedis.convertToArray(strListRefreshToken!);
        return lstRefreshToken;
    }

    findAccessToken = async (userId: number, accessToken: string) => {
        const strListAccessToken = await this.redis.hGetField(this.keyAccessToken, userId.toString());
        const lstAccessToken = AccessTokenInRedis.convertToArray(strListAccessToken!)
        return lstAccessToken.find((tokenRedis: AccessTokenInRedis) => tokenRedis.token == accessToken);
    }

    findRefreshToken = async (userId: number, refreshToken: string) => {
        const strListRefreshToken = await this.redis.hGetField(this.keyRefreshToken, userId.toString());
        const lstRefreshToken = RefreshTokenInRedis.convertToArray(strListRefreshToken!)
        return lstRefreshToken.find((tokenRedis: RefreshTokenInRedis) => tokenRedis.token == refreshToken);
    }

    checkAccessTokenInRedis = async (userId: number, accessToken: string) => {
        const token = await this.findAccessToken(userId, accessToken);
        if (!token)
            throw Err.InvalidToken;
        if (token.ex < Date.now())
            throw Err.InvalidToken;
        return token;
    }

    checkRefreshTokenInRedis = async (userId: number, refreshToken: string) => {
        const token = await this.findRefreshToken(userId, refreshToken);
        if (!token) {
            throw Err.InvalidToken;
        }
        if (token.ex < Date.now())
            throw Err.InvalidToken;
        return token;
    }

    clearAccessToken = async (userId: number, accessToken: string) => {
        const strListAccessToken = await this.redis.hGetField(this.keyAccessToken, userId.toString());
        const lstAccessToken = AccessTokenInRedis.convertToArray(strListAccessToken!)
        const newLstAccessToken = lstAccessToken.filter((tokenRedis) => tokenRedis.token != accessToken);
        await this.hsetAccessToken(userId, JSON.stringify(newLstAccessToken));
    }

    clearRefreshToken = async (userId: number, refreshToken: RefreshTokenInRedis) => {
        const strListRefreshToken = await this.redis.hGetField(this.keyRefreshToken, userId.toString());
        const lstRefreshToken = RefreshTokenInRedis.convertToArray(strListRefreshToken!)
        const newLstRefreshToken = lstRefreshToken.filter((tokenRedis) => tokenRedis.token != refreshToken.token);
        await this.hsetRefreshToken(userId, JSON.stringify(newLstRefreshToken));
        await this.clearAccessToken(userId, refreshToken.refToken);
    }

    clearAllTokens = async (userId: number) => {
        await this.redis.hDelField(this.keyAccessToken, userId.toString());
        await this.redis.hDelField(this.keyRefreshToken, userId.toString());
    }
}