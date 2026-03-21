import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { LocationsModule } from './locations/locations.module';
import { ManagersModule } from './managers/managers.module';
import { ProductsModule } from './products/products.module';
import { ProvidersModule } from './providers/providers.module';
import { RegionsModule } from './regions/regions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.host,
      port: Number(process.env.port),
      username: 'postgres',
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
      //logging: true,
      extra: {
        max: 20, // Increases the number of simultaneous connections allowed
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      },
    }),
    EmployeesModule, 
    ProductsModule, 
    ProvidersModule, ManagersModule, LocationsModule, RegionsModule, AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
