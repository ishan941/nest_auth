import { IsEmail, IsString, MinLength } from "class-validator";
import { Column } from "typeorm";

export class RegisterDto {
    @Column()
    id: string

    @IsString()
    fullName: string

    @IsEmail()
    email: string

    @IsString()
    phone: string

    @IsString()
    @MinLength(6)
    password: string


}