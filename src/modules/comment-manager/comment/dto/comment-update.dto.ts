import { plainToInstance } from "class-transformer";
import { IsString } from "class-validator";

export class CommentUpdate {
    commentId?: number;
    userId!: number;
    postId!: number;

    @IsString()
    content!: string;

    parentCommentId?: number;

    static convert = (data: any): CommentUpdate => {
        return plainToInstance(CommentUpdate, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}