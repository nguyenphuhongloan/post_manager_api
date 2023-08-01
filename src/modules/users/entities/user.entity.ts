import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntities } from "../../../base/base.entities";
import { Exclude, Expose, instanceToPlain, plainToInstance } from "class-transformer";
import { MinLength } from "class-validator";
import { proc, procName } from "../../../database/procedure";

export enum Role {
    Admin = 1,
    User = 0,
    Moderator = 2
}

export enum Gender {
    Male = 0,
    Female = 1
}

@Entity("users")
export class User extends BaseEntities {
    @Expose()
    @PrimaryGeneratedColumn({ name: "UserId" })
    userId!: number;

    @Expose()
    @Column("varchar", { name: "Name" })
    name!: string;

    @Expose()
    @Column("varchar", { name: "Email" })
    email!: string;

    @Expose({ toClassOnly: true })
    @Exclude({ toPlainOnly: true })
    @MinLength(6)
    @Column("varchar", { name: "Password" })
    password!: string;

    @Expose()
    @Column("date", { name: "Dob", nullable: true })
    dob?: Date;

    @Expose()
    @Column("varchar", { name: "Avatar", nullable: true })
    avatar?: string;

    @Expose()
    @Column("tinyint", { name: "Gender", nullable: true })
    gender?: Gender;

    @Expose()
    @Column("varchar", { name: "Phone", nullable: true })
    phone?: string;

    @Expose()
    @Column("varchar", { name: "Address", nullable: true })
    address?: string;

    @Expose()
    @Column("tinyint", { name: "Role", default: Role.User })
    role!: Role;

    @Expose()
    @Column("tinyint", { name: "IsDeleted", default: 0 })
    isDeteted!: number;

    static convert = <T>(data: T) => {
        return plainToInstance(User, data, { strategy: "exposeAll", exposeUnsetFields: false });
    }

    static getPlain = (data: any) => {
        return instanceToPlain(data, { exposeUnsetFields: false, excludeExtraneousValues: true });
    }

    static procGetUserDetails = async (userId: number): Promise<User> => {
        const data = await proc(procName.getUserDetail, [userId]);
        const res = User.procToUser(data);
        return res;
    }

    private static procToUser = (data: any): User => {
        return User.convert(data[0][0]);
    }
}