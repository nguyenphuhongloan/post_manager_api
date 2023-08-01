import { EntityManager } from "typeorm";
import AppDataSource from "../../database/connection";
import { OTP } from "./entities/otp.entity";
import { Service } from "typedi";
import { Err } from "../../helpers/error";

export enum OTPType {
    Register = "Register",
}

@Service()
export class OTPService {
    private readonly timeExpired = 60 * 1000;
    verifyOTP = async (email: string, otpCode: string, type: OTPType) => {
        const data = await OTP.findOne({
            where: {
                email: email, code: otpCode, type: type, isUsed: 0
            }
        });
        if(!data)
            throw Err.InvalidOTP;
        if(data.expires.getTime() < Date.now())
            throw Err.InvalidOTP;
        return data;
    }

    saveOTP = async (otp: OTP) => {
        otp.expires = new Date(Date.now() + this.timeExpired);
        const data = await OTP.save(otp);
        return data;
    }

    generateOTP = () => {
        let otp = '';
        for (let i = 0; i < 4; i++) {
            const random = Math.floor(Math.random() * 36);
            if (random >= 10) {
                const randomType = Math.floor(Math.random() * 1);
                const charCode = randomType == 0 ? Math.floor(Math.random() * 26) + 65 : Math.floor(Math.random() * 26) + 97
                otp += String.fromCharCode(charCode);
            } else otp += String(random);
        }
        return otp;
    }

    setExpired = async (email: string, type: OTPType) => {
        await AppDataSource.transaction(async (transaction: EntityManager) => {
            await transaction.update(OTP, { email: email, type: type }, { isUsed: 1 });
        });
    }
}

