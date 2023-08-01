import { Router } from "express";
import Container from "typedi";
import { PostViewsController } from "./post-views.controller";
import { AuthMiddleware } from "../../auth/auth.middleware";

const postViewsController = Container.get(PostViewsController);
const authMiddleware = Container.get(AuthMiddleware);

const router = Router();

router.get("/", authMiddleware.verifyAccessToken, postViewsController.getPostViewed);

export default router;