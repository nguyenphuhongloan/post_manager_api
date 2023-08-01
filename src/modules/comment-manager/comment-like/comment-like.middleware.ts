import { NextFunction, Request, Response } from "express";
import { CommentLikeUpdate } from "./dto/comment-like-update.dto";
import { ValidationError } from "class-validator";
import { handleErrorValidate } from "../../../helpers/error";
import { validateBody } from "../../../helpers/validate";
import { Service } from "typedi";

@Service()
export class CommentLikeMiddleWare {
    validateLikeCommment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = CommentLikeUpdate.convert(req.body);
            await validateBody(req.body);
            next();
        } catch (error) {
            const errValidate = handleErrorValidate(error as unknown as ValidationError[]);
            next(errValidate);
        }
    }
}