import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, QueryFailedError } from "typeorm";
import { Exclude, Expose, plainToInstance } from "class-transformer";
import { BaseEntity } from "../../../../base/base.entities";
import { proc, procName } from "../../../../database/procedure";
import { Err } from "../../../../helpers/error";
import MailMessage from "nodemailer/lib/mailer/mail-message";


@Entity("posts")
export class Post extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn({ name: "PostId" })
    postId!: number;

    @Expose()
    @Column("varchar", { name: "Title", length: 250 })
    title!: string;

    @Expose()
    @Column("text", { name: "Content" })
    content!: string;

    @Expose()
    @Column("varchar", { name: "Thumbnail", length: 2048 })
    thumbnail!: string;

    @Expose()
    @Column("int", { name: "Category" })
    category!: number;

    @Expose()
    @Column("datetime", { name: "Datetime", default: () => "CURRENT_TIMESTAMP" })
    datetime!: string;

    @Expose()
    @Column("varchar", { name: "Author", length: 125 })
    author!: number;

    @Expose()
    @Column("varchar", { name: "Tags", })
    tags!: string[] | string;

    @Expose()
    @Column("tinyint", { name: "Status" })
    status!: StatusPost;

    @Expose()
    @Column("varchar", { name: "Description", length: 500 })
    description!: string;


    @BeforeInsert()
    @BeforeUpdate()
    @Exclude()
    convertToTagsString() {
        if (Array.isArray(this.tags))
            this.tags = this.tags.join(' ');
    }

    convertToTagsList() {
        if (typeof this.tags === 'string')
            this.tags = this.tags.split(' ');
    }

    static convert = (data: any) => {
        return plainToInstance(Post, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }

    static convertAndExcludeExtraneousValues = (data: any) => {
        return plainToInstance(Post, data, { strategy: "exposeAll", exposeUnsetFields: false, excludeExtraneousValues: true });
    }

    static procViewPostId = async (postId: number) => {
        const data = await proc(procName.viewPostId, [postId]);
        const res = Post.procToPost(data);
        return res;
    }

    static procGetPostsByCategory = async (category: number, limit: number, offset: number) => {
        const data = proc(procName.getPostsByCategory, [category, limit, offset, 0]);
        const total = proc(procName.getPostsByCategory, [category, limit, offset, 1]);
        const res = await Promise.all([data, total]);
        const resData = Post.procToListPosts(res[0]);

        return {
            data: resData,
            total: res[1]
        };
    }

    static procGetPostsByTitleKeyword = async (category: string, limit: number, offset: number) => {
        const data = proc(procName.getPostsByTitleKeyword, [category, limit, offset, 0]);
        const total = proc(procName.getPostsByTitleKeyword, [category, limit, offset, 1]);
        const res = await Promise.all([data, total]);
        const resData = Post.procToListPosts(res[0]);
        return {
            data: resData,
            total: res[1]
        };
    }

    static procGetPostsByTag = async (tag: string, limit: number, offset: number) => {
        const data = proc(procName.getPostsByTag, [tag, limit, offset, 0]);
        const total = proc(procName.getPostsByTag, [tag, limit, offset, 1]);
        const res = await Promise.all([data, total]);
        const resData = Post.procToListPosts(res[0]);
        return {
            data: resData,
            total: res[1]
        };
    }

    static procGetPostDetail = async (postId: number) => {
        const data = await proc(procName.viewPostId, [postId]);
        const res = Post.procToPost(data)
        return res;
    }

    static procGetSavedPost = async (userId: number, limit: number, offset: number) => {
        const data = proc(procName.getSavedPost, [userId, limit, offset, 0]);
        const total = proc(procName.getSavedPost, [userId, limit, offset, 1]);
        const res = await Promise.all([data, total]);
        const resData = Post.procToListPosts(res[0]);
        return {
            data: resData,
            total: res[1]
        };
    }

    static statisticViewAndComment = async (limit: number, offset: number) => {
        const data = proc(procName.statisticPostViewsAndComments, [limit, offset, 0]);
        const total = proc(procName.statisticPostViewsAndComments, [limit, offset, 1]);
        const res = await Promise.all([data, total]);
        const resData = Post.procToListPosts(res[0]);
        return {
            data: resData,
            total: res[1]
        };
    }

    static procToPost = (data: any) => {
        if (!data?.[0]?.[0])
            throw Err.PostNotFound;
        const post = Post.convert(data[0][0]);
        post.convertToTagsList();
        return post;
    }

    static procToListPosts = (data: any): Post[] => {
        const lstPost = Post.convert(data?.[0]) as unknown as Post[];
        lstPost.map(e => e.convertToTagsList());
        return lstPost;
    }

}

export enum StatusPost {
    Published = 1,
    Draft = 0,
    Delete = 3
}
