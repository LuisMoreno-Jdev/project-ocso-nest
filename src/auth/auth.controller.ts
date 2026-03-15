import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() createUserDto: CreateUserDto){
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto){
    return this.authService.loginUser(createUserDto);
  }

}
