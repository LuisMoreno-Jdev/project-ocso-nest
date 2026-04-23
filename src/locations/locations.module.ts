import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from 'src/managers/entities/manager.entity';
import { ManagersModule } from 'src/managers/managers.module';
import { Location } from './entities/location.entity';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Manager]), ManagersModule],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
