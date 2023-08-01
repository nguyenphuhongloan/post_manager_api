import { Router } from "express";
import Container from "typedi";
import { CommentLikeController } from "./comment-like.controller";
import { AuthMiddleware } from "../../auth/auth.middleware";
import { CommentLikeMiddleWare } from "./comment-like.middleware";

const authMiddleware = Container.get(AuthMiddleware);
const commentLikeMiddleWare = Container.get(CommentLikeMiddleWare);
const commentLikeController = Container.get(CommentLikeController);

const router = Router();
router.post("/:commentId",
    authMiddleware.verifyAccessToken,
    commentLikeMiddleWare.validateLikeCommment,
    commentLikeController.likeComment
) 

export default router;