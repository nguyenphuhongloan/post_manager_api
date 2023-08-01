import { Inject, Service } from "typedi";
import { UserService } from "./user.service";
import { Request, Response, NextFunction } from "express";
import { UserRegister } from "./dto/user-register.dto";
import { HandleResponse } from "../../helpers/response";
import { UserLogin } from "./dto/user-login.dto";
import { UserUpdate } from "./dto/user-update.dto";
import { AuthRequest, BodyRequest } from "../auth/auth.services";
import { UserChangePassword } from "./dto/user-change-password.dto";
import { UserLogout } from "./dto/user-logout.dto";
import { FolderUploadName, UploadService } from "../upload/upload.service";
@Service()
export class UserController {
    @Inject()
    userService!: UserService;

    @Inject()
    uploadService!: UploadService;

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.body as UserRegister;
            const data = await this.userService.register(user);
            return res.send(new HandleResponse(data));
        } catch (error) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.body as UserLogin;
            const data = await this.userService.login(user);
            return res.send(new HandleResponse(data));
        } catch (error) {
            next(error);
        }
    }

    updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const user = req.body as UserUpdate;
            user.userId = req.userId!;
            user.avatar = req.file ? await this.uploadService.uploadImage(req.file, FolderUploadName.Avatar) : undefined;
            const data = await this.userService.updateUser(user);
            return res.send(new HandleResponse(data));
        } catch (error) {
            next(error);
        }
    }

    refreshToken = async (req: AuthRequest, res: Response, next: NextFunction) =>{
        try {
            const data = await this.userService.refreshToken(Number(req.userId), req.refreshToken!);
            return res.send(new HandleResponse(data));
        } catch (error) {
            next(error);
        }
    }

    changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const user = req.body as UserChangePassword;
            const data = await this.userService.changePassword(user);
            return res.send(new HandleResponse(data));
        } catch (error) {
            next(error);
        }
    }

    verifyRegister = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const user = req.body as UserRegister;
            const data = await this.userService.createUser(user);
            return res.send(new HandleResponse(data));
        } catch (error) {
            next(error);
        }
    }

    logout = async (req: BodyRequest<UserLogout>, res: Response, next: NextFunction) => {
        try {
            await this.userService.logout(Number(req.userId), req.refreshToken!)
            return res.send(new HandleResponse(null));
        } catch (error) {
            next(error);
        }
    }
}