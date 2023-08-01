import { BaseEntity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class BaseEntities extends BaseEntity {
    @Column("int", { name: "CreatedBy", default: 1, })
    createdBy!: number;

    @CreateDateColumn({ name: "CreatedDate", })
    createdDate!: Date;

    @Column("int", { name: "UpdatedBy", default: 1 })
    updatedBy!: number;

    @UpdateDateColumn({ name: "UpdatedDate", default: () => "CURRENT_TIMESTAMP" })
    updatedDate!: Date;
}