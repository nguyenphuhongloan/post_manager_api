import { plainToInstance } from "class-transformer";
import { Column, Entity } from "typeorm";
import { proc, procName } from "../../../../database/procedure";

@Entity("post_view")
export class PostView {
    @Column("int", { name: "PostId", primary: true, })
    postId!: number;

    @Column("int", { name: "TotalViews", default: 0 })
    totalViews!: number;

    static convert = <T>(data: T) => {
        return plainToInstance(PostView, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }

    static procIncreseView = async (postId: number) => {
        const data = await proc(procName.increaseView, [postId]);
        const res = PostView.getTotal(data)
        return res;
    }

    private static getTotal = (data: any): number => {
        return Number(data[0][0].totalViews);
    }
}