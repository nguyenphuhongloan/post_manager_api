import { Response } from 'express';
import { HandleResponse } from './response';
import { ValidationError } from 'class-validator';

export class AppError extends Error {
    readonly code: string;
    readonly message: string;
    readonly status?: number;

    constructor(code: string, message: string, status?: number) {
        super();
        this.code = code;
        this.message = message;
        this.status = status;
    }
}

export const Err = {
    BadRequest: new AppError("BadRequest", "Bad request", 400),
    UserNotFound: new AppError("UserNotFound", "User not found"),
    InvalidToken: new AppError("InvalidToken", "Invalid token"),
    EmailNotFound: new AppError("EmailNotFound", "Email not found"),
    EmailExists: new AppError("EmailExists", "Email already exists"),
    EmailOrPasswordIncorrect: new AppError("EmailOrPasswordIncorrect", "Email or password incorrect"),
    InvalidOTP: new AppError("InvalidOTP", "Invalid OTP"),
    InvalidFileType: new AppError("InvalidFileType", "Invalid file type"),
    NotEnoughPermission: new AppError("NotEnoughPermission", "Not enough permission"),
    PostNotFound: new AppError("PostNotFound", "Post not found"),
    CommentNotFound: new AppError("CommentNotFound", "Comment not found"),
    CommentReplyNotFound: new AppError("CommentReplyNotFound", "Comment reply not found"),
    CategoryNotFound: new AppError("CategoryNotFound", "Category not found"),
}

export const handleErrorValidate = (error: ValidationError[]) => {
    const firstErrorValidate = error[0].constraints as any;
    const key = Object.keys(firstErrorValidate)[0]
    const err = new AppError(Err.BadRequest.code, firstErrorValidate[key], Err.BadRequest.status);
    return err;
}

export const handleError = (err: AppError | Error, res: Response) => {
    const errorStatus: number = ((err as AppError)?.status ?? Err.BadRequest.status) as number;
    return res.status(errorStatus).json(new HandleResponse(null, err));
}

