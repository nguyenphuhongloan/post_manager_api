import { ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { handleErrorValidate } from "../../../helpers/error";
import { validateBody, validateQuery } from "../../../helpers/validate";
import { Service } from "typedi";
import { CommentCreate } from "./dto/comment-create.dto";
import { CommentUpdate } from "./dto/comment-update.dto";
import { CommentSort } from "./dto/comment-sort.dto";

@Service()
export class CommentMiddleware {
    validateSortComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = CommentSort.convert(req.query);
            await validateQuery(query);
            next();
        } catch (error) {
            const errValidate = handleErrorValidate(error as unknown as ValidationError[]);
            next(errValidate);
        }
    }

    validateCreateComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = CommentCreate.convert(req.body);
            await validateBody(req.body);
            next();
        } catch (error) {
            const errValidate = handleErrorValidate(error as unknown as ValidationError[]);
            next(errValidate);
        }
    }

    validateUpdateComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = CommentUpdate.convert(req.body);
            await validateBody(req.body);
            next();
        } catch (error) {
            const errValidate = handleErrorValidate(error as unknown as ValidationError[]);
            next(errValidate);
        }
    }
}