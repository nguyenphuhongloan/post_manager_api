import { EntityManager } from "typeorm";
import AppDataSource from "../../database/connection";
import { UserRegister } from "./dto/user-register.dto";
import bcrypt from "bcrypt";
import { Role, User } from "./entities/user.entity";
import { Err } from "../../helpers/error";
import { Inject, Service } from "typedi";
import { UserLogin } from "./dto/user-login.dto";
import { UserUpdate } from "./dto/user-update.dto";
import { AuthPayload, AuthService } from "../auth/auth.services";
import { RefreshTokenInRedis, TokenRedisService } from "../auth/token.redis.service";
import { UserChangePassword } from "./dto/user-change-password.dto";
import { EmailService } from "../email/email.service";
import { emailQueueName } from '../queue/mail-queue.service';
import { EmailOption, RegisterOption, emailTemplate } from "../email/dto/email-option.dto";
import { OTPService, OTPType } from "../otp/otp.service";
import { OTP } from "../otp/entities/otp.entity";

@Service()
export class UserService {
    @Inject()
    authService!: AuthService;

    @Inject()
    private tokenRedisService!: TokenRedisService;

    @Inject()
    private emailService!: EmailService;

    @Inject()
    private readonly otpService!: OTPService;

    register = async (user: UserRegister) => {
        const userPayload = User.convert(user);
        const isEmailExists = await User.findOne({ where: { email: userPayload.email, isDeteted: 0 } });
        if (isEmailExists)
            throw Err.EmailExists;
        const otp = this.otpService.generateOTP()
        const registerOption: RegisterOption = {
            name: user.name,
            otp: otp
        }
        const emailOption = new EmailOption<RegisterOption>(user.email, registerOption, emailTemplate.register);
        this.emailService.addSendEmailQueue(emailQueueName, emailOption);
        userPayload.password = await bcrypt.hash(userPayload.password, 8);
        const objOTP = Object.assign(userPayload, { code: otp, type: OTPType.Register }) as unknown as OTP;
        await this.otpService.saveOTP(objOTP);
        return User.getPlain(objOTP);
    }

    createUser = async (user: UserRegister) => {
        const userPayload = User.convert(user);
        const data = await AppDataSource.transaction(async (transaction: EntityManager) => {
            const isEmailExists = await transaction.findOne(User, { where: { email: userPayload.email, isDeteted: 0 } });
            if (isEmailExists)
                throw Err.EmailExists;
            const userRes = await transaction.save(userPayload);
            return userRes;
        });
        const newUser = await User.procGetUserDetails(data.userId);
        return newUser;
    }

    login = async (user: UserLogin) => {
        const userRes = await User.findOne({ where: { email: user.email, isDeteted: 0 } });
        if (!userRes)
            throw Err.EmailOrPasswordIncorrect;
        const isPasswordMatched = await bcrypt.compare(user.password, userRes.password);
        if (!isPasswordMatched)
            throw Err.EmailOrPasswordIncorrect;
        const data = await User.procGetUserDetails(userRes.userId);
        const authPayload = AuthPayload.createAuthPayloadObject(data.userId) as AuthPayload;
        const accessToken = this.authService.createAccessToken(authPayload);
        const refreshToken = this.authService.createRefreshToken(authPayload);
        this.tokenRedisService.saveToken(data.userId, accessToken, refreshToken);
        return {
            ...data,
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    updateUser = async (user: UserUpdate) => {
        const isUserExist = await User.procGetUserDetails(user.userId);
        if (!isUserExist)
            throw Err.UserNotFound;
        const userPayload = UserUpdate.convert(user);
        await User.update({ userId: userPayload.userId }, userPayload);
        const data = User.procGetUserDetails(userPayload.userId);
        return data;
    }

    refreshToken = async (userId: number, refreshToken: RefreshTokenInRedis) => {
        await this.tokenRedisService.clearRefreshToken(userId, refreshToken);
        const authPayload = AuthPayload.createAuthPayloadObject(userId) as AuthPayload;
        const newAccessToken = this.authService.createAccessToken(authPayload);
        const newRefreshToken = this.authService.createRefreshToken(authPayload);
        this.tokenRedisService.saveToken(userId, newAccessToken, newRefreshToken);
        const data = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
        return data;
    }

    changePassword = async (user: UserChangePassword) => {
        const data = await AppDataSource.transaction(async (transaction: EntityManager) => {
            const userRes = await transaction.findOne(User, { where: { email: user.email, isDeteted: 0 } });
            if (!userRes)
                throw Err.EmailOrPasswordIncorrect;
            const isPasswordMatched = await bcrypt.compare(user.password, userRes.password);
            if (!isPasswordMatched)
                throw Err.EmailOrPasswordIncorrect;
            const newPassword = await bcrypt.hash(user.newPassword, 8);
            await transaction.update(User, { email: user.email }, { password: newPassword });
            return await User.procGetUserDetails(userRes.userId);
        });

        this.tokenRedisService.clearAllTokens(data.userId);
        const authPayload = AuthPayload.createAuthPayloadObject(data.userId) as AuthPayload;
        const accessToken = this.authService.createAccessToken(authPayload);
        const refreshToken = this.authService.createRefreshToken(authPayload);
        this.tokenRedisService.saveToken(data.userId, accessToken, refreshToken);
        return {
            ...data,
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    logout = async (userId: number, refreshToken: RefreshTokenInRedis) => {
        await this.tokenRedisService.clearRefreshToken(userId, refreshToken);
    }

    isAdminOrModerator = async (userId: number) => {
        const data = await User.procGetUserDetails(userId);
        if (data.role == Role.Admin || data.role == Role.Moderator)
            return data;
        throw Err.NotEnoughPermission;
    }
}