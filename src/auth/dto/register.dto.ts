import { IsString } from "class-validator";
import { Column } from "typeorm";

export class RgisterDto{
   @Column()
    id: string

    @IsString()
    fullName: string

    
        @IsString()
        phone: string
    
        @IsString()
        password: string


}