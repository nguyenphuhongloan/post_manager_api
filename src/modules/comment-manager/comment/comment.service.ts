import { Inject, Service } from "typedi";
import { CommentCreate } from "./dto/comment-create.dto";
import { Comment, StatusComment } from "./entities/comment.entity";
import AppDataSource from "../../../database/connection";
import { Err } from "../../../helpers/error";
import { Post, StatusPost } from "../../post-manager/post/entities/post.entity";
import { UserService } from "../../users/user.service";
import { TotalComments } from "../total_comments/entities/totalComment.entity";
import { CommentUpdate } from "./dto/comment-update.dto";
import { User } from "../../users/entities/user.entity";

@Service()
export class CommentService {
    @Inject()
    private readonly userService!: UserService;

    getComment = async (commentId: number) => {
        const data = await Comment.procGetCommentDetail(commentId);
        if (!data)
            throw Err.CommentNotFound;
        return data;
    }

    createComment = async (comment: CommentCreate) => {
        const commentPayload = Comment.convert(comment);
        const post = await Post.findOne({ where: { postId: comment.postId, status: StatusPost.Published } });
        if (!post)
            throw Err.PostNotFound;
        if (comment.parentCommentId) {
            const commentParent = await this.findParentComment(comment.parentCommentId!);
            if (commentParent.postId != comment.postId)
                throw Err.PostNotFound;
            commentPayload.parentCommentId = commentParent.commentId;
        }
        const data = AppDataSource.transaction(async () => {
            const comment = await Comment.save(commentPayload);
            return comment;
        });
        return data;
    }

    updateComment = async (comment: CommentUpdate) => {
        const isCommentExist = await Comment.findOne({ where: { commentId: comment.commentId, userId: comment.userId, status: StatusComment.Published } });
        if (!isCommentExist)
            throw Err.CommentNotFound;
        const commentPayload = Comment.convert(comment);
        await Comment.update({ commentId: comment.commentId }, commentPayload);
        const data = await Comment.procGetCommentDetail(commentPayload.commentId);
        return data;
    }

    deleteComment = async (commentId: number, userId: number) => {
        const comment = await Comment.findOne({ where: { commentId: commentId, status: StatusComment.Published } })
        if (!comment)
            throw Err.CommentNotFound;
        let status: StatusComment = StatusComment.Deleted;
        if (userId != comment.userId) {
            await this.userService.isAdminOrModerator(userId);
            status = StatusComment.Hinding;
        }
        AppDataSource.transaction(async () => {
            await Comment.update({ commentId: commentId }, { status: status });
            await Comment.update({ parentCommentId: commentId }, { status: status });
        });
    };

    private findParentComment = async (commentId: number): Promise<Comment> => {
        const commentParent = await Comment.findOne({ where: { commentId: commentId, status: StatusComment.Published } });
        if (commentParent?.parentCommentId == 0)
            return commentParent;
        if (!commentParent)
            throw Err.CommentNotFound;
        return this.findParentComment(commentParent!.parentCommentId);
    }

    getCommentsByPostId = async (postId: number, userId: number, limit: number, offset: number, sort: number) => {
        const post = await Post.findOne({ where: { postId: postId, status: StatusPost.Published } });
        if (!post)
            throw Err.PostNotFound;
        const data = await Comment.procGetCommentsByPostId(postId, userId, limit, offset, sort);

        return data;
    }

    getCommentsReply = async (commentId: number, limit: number, offset: number) => {
        const comment = await Comment.findOne({ where: { commentId: commentId, status: StatusComment.Published } });
        if (!comment)
            throw Err.PostNotFound;
        const data = await Comment.procGetCommentsReply(commentId, limit, offset);
        if (data.data.length == 0)
            throw Err.CommentReplyNotFound;
        return data;
    }

    getCommentByUserId = async (userId: number, limit: number, offset: number) => {
        const user = await User.findOne({ where: { userId: userId, isDeteted: 0 } });
        if (!user)
            throw Err.UserNotFound;
        const data = await Comment.procGetCommentsByUserId(userId, limit, offset);
        return data;
    }
}
