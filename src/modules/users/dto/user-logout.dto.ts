import { Expose, plainToClass } from "class-transformer";
import { IsString } from "class-validator";

export class UserLogout {
    @Expose()
    @IsString()
    refreshToken!: string;

    static convert = (data: any) => {
        return plainToClass(UserLogout, data, { strategy: "exposeAll", exposeUnsetFields: false }) as UserLogout;
    }
}