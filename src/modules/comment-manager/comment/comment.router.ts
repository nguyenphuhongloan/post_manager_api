import { Router } from 'express';
import Container from 'typedi';
import { AuthMiddleware } from '../../auth/auth.middleware';
import { CommentMiddleware } from './comment.middleware';
import { CommentController } from './comment.controller';
import commentLikeRouter from '../comment-like/comment-like.router'

const authMiddleware = Container.get(AuthMiddleware);
const commentMiddleware = Container.get(CommentMiddleware);
const commentController = Container.get(CommentController);

const router = Router();

router.use("/like", commentLikeRouter);

router.get("/post/:postId",
    authMiddleware.verifyAccessToken,
    commentMiddleware.validateSortComment,
    commentController.getCommentsByPostId
);

router.get("/user",
    authMiddleware.verifyAccessToken,
    commentController.getCommentsByUserId
);

router.get("/reply/:commentId",
    authMiddleware.verifyAccessToken,
    commentController.getCommentsReply
); 

router.get("/:commentId", authMiddleware.verifyAccessToken, commentController.getComment);

router.post("/reply/:commentId",
    authMiddleware.verifyAccessToken,
    commentMiddleware.validateCreateComment,
    commentController.createReplyComment
)

router.post("/:postId",
    authMiddleware.verifyAccessToken,
    commentMiddleware.validateCreateComment,
    commentController.createComment
);

router.put("/:commentId",
    authMiddleware.verifyAccessToken,
    commentMiddleware.validateUpdateComment,
    commentController.updateComment
);

router.delete("/:commentId", authMiddleware.verifyAccessToken, commentController.deleteComment);

export default router;