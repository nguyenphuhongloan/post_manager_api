import { Inject, Service } from "typedi";
import { CommentLikeService } from "./comment-like.service";
import { NextFunction, Response } from "express";
import { CommentLikeUpdate } from "./dto/comment-like-update.dto";
import { AuthRequest } from "../../auth/auth.services";
import { HandleResponse } from "../../../helpers/response";

@Service()
export class CommentLikeController {
    @Inject()
    private readonly commentLikeService!: CommentLikeService

    likeComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const commentLike = req.body as CommentLikeUpdate;
            commentLike.userId = Number(req.userId);
            commentLike.commentId = Number(req.params.commentId);
            const data = await this.commentLikeService.likeComment(commentLike);
            return res.send(new HandleResponse(data))
        } catch (error) {
            next(error);
        }
    }
}