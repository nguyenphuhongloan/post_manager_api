import { Type, plainToInstance } from "class-transformer";
import { IsEnum, IsString } from "class-validator";

export enum PostSearchType {
    Title = "title",
    Tag = "tag"
}
export class PostSearch {
    @Type(() => String)
    keyword!: string;

    @IsEnum(PostSearchType)
    searchBy!: string
    static convert = (data: any): PostSearch => {
        return plainToInstance(PostSearch, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}