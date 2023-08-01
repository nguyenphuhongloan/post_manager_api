import { Request, Response, NextFunction } from "express";
import { UserRegister } from "./dto/user-register.dto";
import { ValidationError } from "class-validator";
import { validateBody } from "../../helpers/validate";
import { Service } from "typedi";
import { Err, handleErrorValidate } from "../../helpers/error";
import { UserLogin } from "./dto/user-login.dto";
import { UserUpdate } from "./dto/user-update.dto";
import { AuthRequest } from "../auth/auth.services";
import { UserChangePassword } from "./dto/user-change-password.dto";
import { UserVerifyRegister } from "./dto/user-verify-email.dto";

@Service()
export class UserMiddleware {
    validateRegister = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = UserRegister.convert(req.body);
            await validateBody(req.body);
            next();
        } catch (error) {
            const errValidate = handleErrorValidate(error as unknown as ValidationError[]);
            next(errValidate);
        }
    }

    validateLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {

            req.body = UserLogin.convert(req.body);
            await validateBody(req.body);
            next();
        } catch (error) {
            const errValidate = handleErrorValidate(error as unknown as ValidationError[]);
            next(errValidate);
        }
    }

    validateUpdate = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (Object.keys(req.body).length === 0)
                next(Err.BadRequest);
            req.body = UserUpdate.convert(req.body);
            await validateBody(req.body);
            next();
        } catch (error) {
            const errValidate = handleErrorValidate(error as unknown as ValidationError[]);
            next(errValidate);
        }
    }

    validateChangePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            req.body = UserChangePassword.convert(req.body);
            await validateBody(req.body);
            next();
        } catch (error) {
            const errValidate = handleErrorValidate(error as unknown as ValidationError[]);
            next(errValidate);
        }
    }

    validateVerifyRegister = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            req.body = UserVerifyRegister.convert(req.body);
            await validateBody(req.body);
            next();
        } catch (error) {
            const errValidate = handleErrorValidate(error as unknown as ValidationError[]);
            next(errValidate);
        }
    }
}