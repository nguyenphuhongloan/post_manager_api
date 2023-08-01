import { Router } from "express";
import { PostSavedController } from "./post-saved.controller";
import Container from "typedi";
import { AuthMiddleware } from "../../auth/auth.middleware";
import { PostSavedMiddleware } from "./post-saved.middleware";

const postSavedMiddleware = Container.get(PostSavedMiddleware);
const postSavedController = Container.get(PostSavedController);
const authMiddleware = Container.get(AuthMiddleware);

const router = Router();

router.get("/", authMiddleware.verifyAccessToken, postSavedController.getSavedPost);
router.post("/:postId", authMiddleware.verifyAccessToken, postSavedMiddleware.validatePostSaved, postSavedController.savedPost);

export default router;