import { plainToInstance } from "class-transformer";
import { IsIn, IsNumber } from "class-validator";

export class PostSavedUpdate {
    userId?: number;
    
    postId?: number;

    @IsNumber()
    @IsIn([0, 1])
    isSave!: number;

    static convert = (data: any): PostSavedUpdate => {
        return plainToInstance(PostSavedUpdate, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}