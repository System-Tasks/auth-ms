import {
    IsEmail,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class LoginUserDto {

    @IsString()
    @IsEmail({}, { message: 'El correo no tiene formato de correo' })
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;
}