import { IsString, Matches, MinLength } from "class-validator";
import { Expose, plainToInstance } from "class-transformer"
export class UserVerifyRegister {
    @Expose()
    @IsString()
    @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Must be an email" })
    email!: string;

    @IsString()
    @MinLength(4)
    otp!: string;

    static convert = (data: any): UserVerifyRegister => {
        return plainToInstance(UserVerifyRegister, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}