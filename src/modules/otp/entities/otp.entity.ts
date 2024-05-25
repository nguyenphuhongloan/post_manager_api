import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { BaseEntity } from "../../../base/base.entities"
import { OTPType } from "../otp.service";

@Entity("otp")
export class OTP extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "UserId" })
    id!: number;

    @Column("varchar", { name: "Email", length: 256 })
    email!: string;

    @Column("varchar", { name: "Name", length: 256 })
    name!: string;

    @Column("varchar", { name: "Password", length: 256 })
    password!: string;

    @Column("varchar", { name: "Code", length: 4 })
    code!: string;

    @Column("varchar", { name: "Type", length: 16 })
    type!: OTPType;

    @Column("datetime", { name: "Expires" })
    expires!: Date;

    @Column("tinyint", { name: "IsUsed", default: 0 })
    isUsed!: number;
}