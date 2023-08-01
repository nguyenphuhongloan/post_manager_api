import { Response, NextFunction, Request } from "express";
import { CommentCreate } from "./dto/comment-create.dto";
import { AuthRequest } from "../../auth/auth.services";
import { CommentService } from "./comment.service";
import { Inject, Service } from "typedi";
import { HandleResponse, Pagination } from "../../../helpers/response";
import { CommentUpdate } from "./dto/comment-update.dto";

@Service()
export class CommentController {
    @Inject()
    private readonly commentService!: CommentService;

    getComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const commentId = Number(req.params.commentId);
            const data = await this.commentService.getComment(commentId);
            res.send(new HandleResponse(data));
        } catch (error) {
            next(error);
        }
    }

    getCommentsByPostId = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const postId = Number(req.params.postId);
            const sort = Number(req.query.sort);
            const userId = req.userId!;
            const { page, limit, offset } = Pagination.paginationReq(req);
            const { data, total } = await this.commentService.getCommentsByPostId(postId, userId, limit, offset, sort);
            res.send(new HandleResponse(data, undefined, new Pagination(page, limit, total)));
        } catch (error) {
            next(error);
        }
    }

    getCommentsByUserId = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId!;
            const { page, limit, offset } = Pagination.paginationReq(req);
            const { data, total } = await this.commentService.getCommentByUserId(userId, limit, offset);
            res.send(new HandleResponse(data, undefined, new Pagination(page, limit, total)));
        } catch (error) {
            next(error);
        }
    }

    getCommentsReply = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postId = Number(req.params.commentId);
            const { page, limit, offset } = Pagination.paginationReq(req);
            const { data, total } = await this.commentService.getCommentsReply(postId, limit, offset);
            res.send(new HandleResponse(data, undefined, new Pagination(page, limit, total)));
        } catch (error) {
            next(error);
        }
    }

    createComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const comment = req.body as CommentCreate;
            comment.userId = req.userId!;
            comment.postId = Number(req.params.postId);
            const data = await this.commentService.createComment(comment);
            res.send(new HandleResponse(data));
        } catch (error) {
            next(error);
        }
    }

    createReplyComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const comment = req.body as CommentCreate;
            comment.userId = req.userId!;
            comment.parentCommentId = Number(req.params.commentId);
            const data = await this.commentService.createComment(comment);
            res.send(new HandleResponse(data));
        } catch (error) {
            next(error);
        }
    }

    updateComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const comment = req.body as CommentUpdate;
            comment.userId = req.userId!;
            comment.commentId = Number(req.params.commentId);
            const data = await this.commentService.updateComment(comment);
            res.send(new HandleResponse(data));
        } catch (error) {
            next(error);
        }
    }

    deleteComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const commentId = Number(req.params.commentId);
            const userId = Number(req.userId);
            await this.commentService.deleteComment(commentId, userId);
            res.send(new HandleResponse(null));
        } catch (error) {
            next(error);
        }
    }
}