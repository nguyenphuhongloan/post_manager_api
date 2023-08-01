import { plainToInstance } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CommentCreate {
    userId!: number;
    postId!: number;

    @IsString()
    content!: string; 

    @IsOptional()
    @IsNumber()
    parentCommentId?: number;

    static convert = (data: any): CommentCreate => {
        return plainToInstance(CommentCreate, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}