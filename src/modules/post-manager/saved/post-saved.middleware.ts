import { NextFunction, Request, Response } from "express";
import { PostSavedUpdate } from "./dto/post-saved-update.dto";
import { ValidationError } from "class-validator";
import { handleErrorValidate } from "../../../helpers/error";
import { validateBody } from "../../../helpers/validate";
import { Service } from "typedi";

@Service()
export class PostSavedMiddleware {
    validatePostSaved = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = PostSavedUpdate.convert(req.body);
            await validateBody(req.body);
            next();
        } catch (error) {
            const errValidate = handleErrorValidate(error as unknown as ValidationError[]);
            next(errValidate);
        }
    }
}