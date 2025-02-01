import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('registerUser')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @MessagePattern('loginUser')
  loginUser(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @MessagePattern('addUserToTeam')
  addUserToTeam(@Payload() data: { userId: string; teamId: string }) {
    return this.authService.addUserToTeam(data.userId, data.teamId);
  }
}
