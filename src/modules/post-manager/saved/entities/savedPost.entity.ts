import { plainToInstance } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseEntities } from "../../../../base/base.entities";

@Entity("saved_posts")
export class PostSaved extends BaseEntities {
    @PrimaryGeneratedColumn({ name: "Id" })
    id!: number;

    @Column("int", { name: "UserId" })
    userId!: number;

    @Column("int", { name: "PostId" })
    postId!: number;

    @Column("tinyint", { name: "isSave" })
    isSave!: number;

    static convert = <T>(data: T) => {
        return plainToInstance(PostSaved, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }



}