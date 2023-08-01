import { plainToInstance } from "class-transformer";
import { IsIn, IsNumber } from "class-validator";

export class CommentLikeUpdate {
    userId!: number;

    commentId!: number;

    @IsNumber()
    @IsIn([0, 1])
    isLike!: number;

    static convert = <T>(data: T) => {
        return plainToInstance(CommentLikeUpdate, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}