import { plainToInstance } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntities } from "../../../base/base.entities";

@Entity("category")
export class Category extends BaseEntities {
    @PrimaryGeneratedColumn({ name: "CategoryId" })
    categoryId!: number;

    @Column("varchar", { name: "Name", length: 125 })
    name!: string;

    @Column("tinyint", { name: "IsDeleted" })
    isDeleted!: number;
    
    static convert = <T>(data: T) => {
        return plainToInstance(Category, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }
}