import { IsArray, IsNotEmpty, IsUUID } from "class-validator";

export class CreateTeamDto {
    @IsArray()
    @IsUUID(undefined, { each: true }) 
    @IsNotEmpty({ message: 'Debe incluir al menos un usuario' })
    users: string[];
}