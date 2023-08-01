import { NextFunction, Request, Response } from "express";
import { PostCreate } from "./dto/post-create.dto";
import { ValidationError } from "class-validator";

import { Service } from "typedi";
import { PostUpdate } from "./dto/post-update.dto";
import { handleErrorValidate } from "../../../helpers/error";
import { validateBody, validateQuery } from "../../../helpers/validate";
import { PostSearch } from "./dto/post-search.dto";

@Service()
export class PostMiddleware {
    validateCreatePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = PostCreate.convert(req.body);
            await validateBody(req.body);
            next();
        } catch (error) {
            const errValidate = handleErrorValidate(error as unknown as ValidationError[]);
            next(errValidate);
        }
    }

    validateUpdatePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = PostUpdate.convert(req.body);
            await validateBody(req.body);
            next();
        } catch (error) {
            const errValidate = handleErrorValidate(error as unknown as ValidationError[]);
            next(errValidate);
        }
    }

    validateQuerySearchPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = PostSearch.convert(req.query);
            await validateQuery(query);
            next();
        } catch (error) {
            const errValidate = handleErrorValidate(error as unknown as ValidationError[]);
            next(errValidate);
        }
    }
}