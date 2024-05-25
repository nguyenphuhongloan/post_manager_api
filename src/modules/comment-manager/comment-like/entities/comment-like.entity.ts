import { plainToInstance } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../../base/base.entities";

@Entity("comment_like")
export class CommentLike extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "Id" })
    id!: number;

    @Column("int", { name: "UserId" })
    userId!: number;

    @Column("int", { name: "CommentId" })
    commentId!: number;

    @Column("tinyint", { name: "IsLike" })
    isLike!: number;

    static convert = <T>(data: T) => {
        return plainToInstance(CommentLike, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}