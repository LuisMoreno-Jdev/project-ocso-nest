import { BadRequestException, Body, Controller, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { AuthService } from './auth.service';
import { CookieName } from './constants/jwt.constants';
import { Cookies } from './decorators/cookies.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/:id')
  registerManager(@Query("role") role: string, @Body() createUserDto: CreateUserDto, @Param('id') id: string){
    if (role === 'Manager') {
      return this.authService.registerManager(id, createUserDto);
    }else if (role === 'Employee') {
      return this.authService.registerEmployee(id, createUserDto);
    }
    throw new BadRequestException('Invalid Role');
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) response: express.Response, @Cookies() cookies: any){
    const token = await this.authService.loginUser(loginUserDto);
    response.cookie(CookieName, token, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7,
         });
    return token;
  }

  @Patch('/:email')
  updateUser(@Param('email') userEmail: string, @Body() updateUserDto: UpdateUserDto){
    return this.authService.updateUser(userEmail, updateUserDto);
  }
}
