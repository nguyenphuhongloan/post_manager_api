import { Type, plainToInstance } from "class-transformer";
import { IsEnum, IsNumberString, IsOptional } from "class-validator";
export enum CommentSortType {
    interest = 0,
    createtAt = 1
}

export class CommentSort {
    @IsOptional()
    @Type(() => Number)
    @IsEnum(CommentSortType)
    sort!: number

    static convert = (data: any): CommentSort => {
        return plainToInstance(CommentSort, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}
