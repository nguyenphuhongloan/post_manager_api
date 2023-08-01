import { IsDateString, IsEnum, IsInt, IsNumber, IsNumberString, IsOptional, IsString, Matches } from "class-validator";
import { Gender } from "../entities/user.entity";
import { Exclude, Transform, Type, plainToInstance } from "class-transformer";

export class UserUpdate {
    userId!: number;

    @IsOptional()
    @IsString()
    name?: string;

    @Matches(/^\d{4}-(0[1-9]|1[0-2])-([0-2][1-9]|3[0-1])$/, { message: "Dob must in yyyy-mm-dd format" })
    @IsDateString()
    @IsOptional()
    dob?: Date;

    @IsOptional()
    @IsString()
    @IsEnum(Gender)
    gender?: Gender;

    @IsOptional()
    avatar?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    static convert = (data: any): UserUpdate => {
        return plainToInstance(UserUpdate, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}