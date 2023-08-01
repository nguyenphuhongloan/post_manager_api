import { Router } from "express";
import Container from "typedi";
import { UserController } from "./user.controller";
import { UserMiddleware } from "./user.middleware";
import { AuthMiddleware } from "../auth/auth.middleware";
import upload from "../upload/upload.service";
import { OTPMiddleware } from "../otp/otp.middleware";

const userController = Container.get(UserController);
const userMiddleware = Container.get(UserMiddleware);
const authMiddleware = Container.get(AuthMiddleware)
const otpMiddleware = Container.get(OTPMiddleware);

const router = Router();
router.post("/register",
    userMiddleware.validateRegister,
    userController.register
);

router.post("/verifyRegister",
    userMiddleware.validateVerifyRegister,
    otpMiddleware.verifyRegister,
    userController.verifyRegister);
    
router.post("/login",
    userMiddleware.validateLogin,
    userController.login
);

router.post("/refreshToken",
    authMiddleware.verifyRefreshToken,
    userController.refreshToken
);
router.put("/changePassword",
    authMiddleware.verifyAccessToken,
    userMiddleware.validateChangePassword,
    userController.changePassword
);

router.put("/", authMiddleware.verifyAccessToken,
    upload.single('avatar'),
    userMiddleware.validateUpdate,
    userController.updateUser
);

router.delete('/logout',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyRefreshTokenLogout,
    userController.logout
);

export default router;
