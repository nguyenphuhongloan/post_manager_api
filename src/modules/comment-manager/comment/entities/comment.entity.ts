import { Column, Entity, PrimaryGeneratedColumn, QueryFailedError } from "typeorm";
import { plainToInstance } from "class-transformer";
import { BaseEntities } from "../../../../base/base.entities";
import { proc, procName } from "../../../../database/procedure";
import { Err } from "../../../../helpers/error";

export enum StatusComment {
    Published = 1,
    Hinding = 0,
    Deleted = 2,
}

@Entity("comments")
export class Comment extends BaseEntities {
    @PrimaryGeneratedColumn({ name: "CommentId" })
    commentId!: number;

    @Column("int", { name: "UserId" })
    userId!: number;

    @Column("int", { name: "PostId" })
    postId!: number;

    @Column("varchar", { name: "Content", length: 255 })
    content!: string;

    @Column("int", { name: "ParentCommentId" })
    parentCommentId!: number;

    @Column("tinyint", { name: "Status", default: StatusComment.Published })
    status!: StatusComment;

    static convert = <T>(data: T) => {
        return plainToInstance(Comment, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }

    static procGetCommentDetail = async (commentId: number) => {
        const data = await proc(procName.getCommentDetail, [commentId]);
        const res = Comment.procToComment(data)
        return res;
    }

    static procGetCommentsByPostId = async (postId: number, userId: number, limit: number, offset: number, sort: number) => {
        const data = await proc(procName.getCommentsByPostId, [postId, userId, limit, offset, sort, 0]);
        const total = await proc(procName.getCommentsByPostId, [postId, limit, userId, offset, sort, 1]);
        const res = await Promise.all([data, total])
        const resData = Comment.procToListComments(res[0]);
        return { data: resData, total: res[1] };
    }

    static procGetCommentsByUserId = async (userId: number, limit: number, offset: number) => {
        const data = await proc(procName.getCommentsByUserId, [userId, limit, offset, 0]);
        const total = await proc(procName.getCommentsByUserId, [userId, limit, offset, 1]);
        const res = await Promise.all([data, total])
        const resData = Comment.procToListComments(res[0]);
        return { data: resData, total: res[1] };
    }

    static procGetCommentsReply = async (commentId: number, limit: number, offset: number) => {
        const data = await proc(procName.getCommentsReply, [commentId, limit, offset, 0]);
        const total = await proc(procName.getCommentsReply, [commentId, limit, offset, 1]);
        const res = await Promise.all([data, total]);
        const resData = Comment.procToListComments(res[0]);
        return { data: resData, total: res[1] };
    }

    static procGetTotalComments = async (postId: number) => {
        const data = await proc(procName.getTotalComments, [postId]);
        const res = Number(data?.[0]?.[0].totalComments);
        return res;
    }

    private static convertNumber = (data: any) => {
        if (data.totalReply) {
            data.totalReply = Number(data.totalReply);
        }
        if (data.totalLikes) {
            data.totalLikes = Number(data.totalLikes);
        }
        return data;
    }

    private static procToComment = (data: any) => {
        if (!data[0][0])
            throw Err.CommentNotFound;
        Comment.convertNumber(data?.[0]?.[0]);
        return Comment.convert(data[0][0]);
    }

    private static procToListComments = (data: any): Comment[] => {
        data[0] = (data[0] as []).map(e => Comment.convertNumber(e));
        return Comment.convert(data[0]) as unknown as Comment[];
    }
}

