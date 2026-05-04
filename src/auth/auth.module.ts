import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ExpiresIn, JWT_KEY } from './constants/jwt.constants';
import { User } from './entities/user.entity';
// IMPORTANTE: Importa las entidades que faltan
import { Employee } from 'src/employees/entities/employee.entity';
import { Manager } from 'src/managers/entities/manager.entity';

@Module({
  imports: [
    // SOLUCIÓN: Agregamos Employee y Manager aquí para que el Service pueda usarlos
    TypeOrmModule.forFeature([User, Employee, Manager]),
    JwtModule.register({
      secret: JWT_KEY,
      signOptions: { 
        expiresIn: ExpiresIn,
      },
      global: true,
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}