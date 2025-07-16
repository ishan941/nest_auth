import { format } from "path";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    fullName: string

    @Column({unique: true})
    email: string
    

    @Column()
    phone: string

    @Column()
    password: string

    @Column({nullable: true})
    refreshToken: string
}