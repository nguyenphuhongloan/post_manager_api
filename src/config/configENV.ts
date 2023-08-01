import DotENV from "dotenv";
import Container, { Service, Token } from "typedi";
DotENV.config();

@Service()
export class Config {
    PORT!: number;
    DB_NAME!: string;
    DB_HOST!: string;
    DB_USER!: string;
    DB_PASSWORD!: string;
    DB_PORT!: number;
    SECRET_ACCESS_TOKEN!: string;
    SECRET_REFRESH_TOKEN!: string;
    EMAIL_SERVICE!: string;
    EMAIL!: string;
    REFRESH_TOKEN!: string;
    REFRESH_TOKEN_MAIL!: string;
    CLIENT_ID!: string;
    CLIENT_SECRET!: string;
    REDIRECT_URL!: string;
    CLOUD_NAME!: string;
    API_KEY!: string;
    API_SECRET!: string;
}

export const config: Config = {
    PORT: process.env.PORT as unknown as number || 3000,
    DB_NAME: process.env.DB_NAME || '',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_PORT: process.env.DB_PORT as unknown as number || 3306,
    SECRET_ACCESS_TOKEN: process.env.SECRET_ACCESS_TOKEN || '',
    SECRET_REFRESH_TOKEN: process.env.SECRET_REFRESH_TOKEN || '',
    EMAIL: process.env.EMAIL!,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN!,
    REFRESH_TOKEN_MAIL: process.env.REFRESH_TOKEN_MAIL!,
    CLIENT_ID: process.env.CLIENT_ID || '',
    CLIENT_SECRET: process.env.CLIENT_SECRET!,
    REDIRECT_URL: process.env.REDIRECT_URL!,
    EMAIL_SERVICE: process.env.EMAIL_SERVICE!,
    CLOUD_NAME: process.env.CLOUD_NAME!,
    API_KEY: process.env.API_KEY!,
    API_SECRET: process.env.API_SECRET!,
}

export const configToken: Token<Config> = new Token<Config>()
Container.set(configToken, config);