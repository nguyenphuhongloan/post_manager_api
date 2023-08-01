import { Request, Response, NextFunction } from "express";
import { Err } from "../../helpers/error";
import { OTPType } from "./otp.service";
import { UserVerifyRegister } from "../users/dto/user-verify-email.dto";
import { OTPService } from "./otp.service";
import { Inject, Service } from "typedi";

@Service()
export class OTPMiddleware {
    @Inject()
    otpService!: OTPService;

    verifyRegister = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const otpInfo = req.body as UserVerifyRegister;
            const otp = await this.otpService.verifyOTP(otpInfo.email, otpInfo.otp, OTPType.Register);
            req.body = Object.assign({}, req.body, otp);
            next()
        } catch (error) {
            next(error);
        }
    }
}