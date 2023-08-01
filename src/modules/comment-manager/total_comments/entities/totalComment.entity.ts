import { Column, Entity } from "typeorm";
import { plainToInstance } from "class-transformer";
import { BaseEntities } from "../../../../base/base.entities";
import { proc, procName } from "../../../../database/procedure";

@Entity("total_comments")
export class TotalComments extends BaseEntities {
    @Column("int", { name: "PostId", primary: true, })
    postId!: number;

    @Column("int", { name: "TotalComments", default: 0 })
    totalComments!: number;

    static convert = <T>(data: T) => {
        return plainToInstance(TotalComments, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }

}