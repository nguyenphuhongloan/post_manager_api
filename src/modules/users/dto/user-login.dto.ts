import { IsString, Matches, MinLength } from "class-validator";
import { Expose, plainToInstance } from "class-transformer"
export class UserLogin {
    @Expose()
    @IsString()
    @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Must be a email" })
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    static convert = (data: any): UserLogin => {
        return plainToInstance(UserLogin, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}