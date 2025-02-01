import {
    IsEmail,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '@prisma/client';

export class CreateUserDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @IsEmail({}, { message: 'El correo debe tener un formato correcto' })
    @Transform(({ value }) => value.toLowerCase())
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La clave debe tener al menos mayúscula, minúscula y un número',
    })
    password: string;

    @IsOptional()
    rol: Role = Role.USER;

    @IsOptional()
    teamId: string;
}