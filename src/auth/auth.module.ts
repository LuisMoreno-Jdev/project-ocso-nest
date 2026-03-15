import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
//import { ExpiresIn, JWT_KEY } from './constants/jwt.constants';
import { User } from './entities/user.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
    secret: "SECRET KEY", //JWT_KEY
    signOptions: { 
      expiresIn: "1h", //ExpiresIn
    },
    global: true,
  })
],
  
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
