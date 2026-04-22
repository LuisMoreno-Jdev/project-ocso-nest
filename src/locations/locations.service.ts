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
  async create(createLocationDto: CreateLocationDto) {
    // 1. Desestructuramos para separar managerId del resto de los datos
    const { managerId, ...locationData } = createLocationDto;

    // 2. Creamos la instancia de la entidad
    const location = this.locationsRepository.create(locationData);

    // 3. Si viene un managerId, lo asignamos a la propiedad de relación 'manager'
    if (managerId) {
      // TypeORM permite asignar el ID directamente a la propiedad de relación 
      // si está configurado con @JoinColumn
      location.manager = managerId; 
    }

    // 4. Guardamos la entidad ya vinculada
    return this.locationsRepository.save(location);
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
