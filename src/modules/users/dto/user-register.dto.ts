import { IsString, Matches, MinLength } from "class-validator";
import { Expose, plainToInstance } from "class-transformer"
export class UserRegister {
    @Expose()
    @IsString()
    @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {message: "Must be an email"})
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @Expose()
    @IsString()
    name!: string;

    static convert = (data: any): UserRegister => {
        return plainToInstance(UserRegister, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}