import { IsString, Matches, MinLength } from "class-validator";
import { Expose, plainToInstance } from "class-transformer"
export class UserChangePassword {
    @Expose()
    @IsString()
    @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Must be an email" })
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    @MinLength(6)
    newPassword!: string;

    static convert = (data: any): UserChangePassword => {
        return plainToInstance(UserChangePassword, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}