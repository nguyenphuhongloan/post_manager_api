import { Service } from "typedi";
import { Err } from "../../../helpers/error";
import { Comment, StatusComment } from "../comment/entities/comment.entity";
import { CommentLikeUpdate } from "./dto/comment-like-update.dto";
import { CommentLike } from "./entities/comment-like.entity";
import { Post, StatusPost } from "../../post-manager/post/entities/post.entity";
import AppDataSource from "../../../database/connection";
import { EntityManager, Transaction } from "typeorm";

@Service()
export class CommentLikeService {
    likeComment = async (commentLike: CommentLikeUpdate) => {
        const savedPostObj = { userId: commentLike.userId, commentId: commentLike.commentId };
        const commentLikePayload = CommentLike.convert({ ...savedPostObj, isLike: 1 });
        const dataRes = await AppDataSource.transaction("SERIALIZABLE", async (trans: EntityManager) => {
            const commentLikeRes = await trans.findOne(CommentLike, {
                where: savedPostObj, lock: {
                    mode: "pessimistic_write"
                },
                transaction: true
            });
            const comment = await Comment.findOne({
                where: { commentId: commentLike.commentId, status: StatusComment.Published }
            });
            if (!comment)
                throw Err.CommentNotFound;
            const post = await Post.findOne({ where: { postId: comment.postId, status: StatusPost.Published } });
            if (!post)
                throw Err.PostNotFound;
            if (!commentLikeRes && !commentLike.isLike)
                throw Err.BadRequest;
            if (commentLikeRes?.isLike == commentLike.isLike)
                throw Err.BadRequest;
            if (!commentLikeRes)
                return trans.save(commentLikePayload);
            await trans.update(CommentLike, { id: commentLikeRes.id }, { isLike: commentLike.isLike });
            const data = await CommentLike.findOne({ where: { id: commentLikeRes.id } });
            return data; 
        })
        return dataRes;
    }
}