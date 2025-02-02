import { IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateTeamDto {
    @IsString()
    id: string;

    @IsArray()
    @IsUUID(undefined, { each: true }) 
    @IsNotEmpty({ message: 'Debe incluir al menos un usuario' })
    users: string[];
}