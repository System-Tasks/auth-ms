import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: CreateUserDto) {
    const { email, password, name } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new RpcException('El usuario ya está registrado');
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER'
      },
    });

    return {
      message: 'Usuario registrado correctamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(loginUserDto: LoginUserDto) {

    let { email, password } = loginUserDto;

    email = email.trim().toLowerCase();

    // Buscar usuario
    const user = await this.prisma.user.findUnique({
        where: { email },
        include: {team: true}
    });
    if (!user) {
      throw new RpcException('Credenciales inválidas - correo');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new RpcException('Credenciales inválidas - clave');
    }

    const token = this.jwtService.sign({ id: user.id, role: user.role });

    return {
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        team: user.team
      },
    };
  }

  async addUserToTeam(userId: string, teamId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new RpcException('Usuario no encontrado');
    }
  
    // Verificar si el equipo existe
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      throw new RpcException('Equipo no encontrado');
    }
  
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { teamId: team.id, role: 'MEMBER' },
    });
  
    return {
      message: 'Usuario agregado al equipo correctamente',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        teamId: updatedUser.teamId,
      },
    };
  }

  async createTeam(createTeamDto: CreateTeamDto) {
    const { id, users } = createTeamDto;


    const teamCreated = await this.prisma.team.create({
      data: {
        users: {
          connect: users.map(id => ({ id }))
        }
      },
      include: {
        users: true
      }
    });

    users.map(async (user) => {
      await this.prisma.user.update({
        where: { id: user },
        data: { role: 'MEMBER' },
      });
    })

    await this.prisma.user.update({
      where: { id },
      data: { role: 'ADMIN' },
    });

    return this.prisma.team.findFirst({
      where: {id: teamCreated.id},
      include: {
        users: true
      }
    });
  }

  async findAllUsers() {
    return {
      data: await this.prisma.user.findMany()
    }
  }
}
