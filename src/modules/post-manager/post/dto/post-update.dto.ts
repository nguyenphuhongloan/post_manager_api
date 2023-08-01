import { IsString, MaxLength, IsDateString, IsArray, IsEnum, IsNumber } from "class-validator";
import { StatusPost } from "../entities/post.entity";
import { plainToInstance } from "class-transformer";

export class PostUpdate {
    postId!: number;

    @IsString()
    @MaxLength(250)
    title?: string;

    @IsString()
    @MaxLength(20000)
    content?: string;
    @IsString()

    @MaxLength(2048)
    thumbnail?: string;

    @IsNumber()
    category?: number;

    @IsDateString()
    datetime?: string;

    @IsString()
    @MaxLength(125)
    author?: string;

    @IsArray()
    @IsString({ each: true })
    @MaxLength(125, { each: true })
    tags?: string[];

    @IsNumber()
    @IsEnum(StatusPost)
    status?: number;

    @IsString()
    @MaxLength(500)
    description?: string;

    static convert = (data: any): PostUpdate => {
        return plainToInstance(PostUpdate, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}