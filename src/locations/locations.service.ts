import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';



@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>
  ){}
  create(createLocationDto: CreateLocationDto){
    return this.locationsRepository.save(createLocationDto);
  }

  findAll() {
    return this.locationsRepository.find();
  }

  findOne(id: number) {
    const location = this.locationsRepository.findOneBy({
      locationId: id,
    })
    if(!location) throw new NotFoundException('Location not found');
    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const locationToUpdate = await this.locationsRepository.preload({
      locationId: id,
      ...updateLocationDto,
    })
    if(!locationToUpdate) throw new BadRequestException();
    return this.locationsRepository.save(locationToUpdate);
  }

  remove(id: number) {
    return this.locationsRepository.delete({
      locationId: id,
    });
  }
}
