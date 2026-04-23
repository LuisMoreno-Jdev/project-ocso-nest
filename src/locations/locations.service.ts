import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Manager } from "src/managers/entities/manager.entity";
import { Repository } from "typeorm";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { Location } from "./entities/location.entity";

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
    @InjectRepository(Manager)
    private managersRepository: Repository<Manager>,
  ) {}
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
    });
    if (!location) throw new NotFoundException("Location not found");
    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
  const { managerId, ...rest } = updateLocationDto as any;

  // 1. Limpieza preventiva
  await this.managersRepository
    .createQueryBuilder()
    .update()
    .set({ location: null as any })
    .where("locationId = :id", { id })
    .execute();

  // 2. Preload de la ubicación
  const locationToUpdate = await this.locationsRepository.preload({
    locationId: id,
    ...rest,
  });

  if (!locationToUpdate) throw new BadRequestException('No se encontró la ubicación');

  // 3. Lógica de doble guardado
  if (managerId) {
    const manager = await this.managersRepository.findOneBy({ managerId });
    if (!manager) throw new BadRequestException('Manager no encontrado');

    // Sincronizamos ambos lados de la relación
    locationToUpdate.manager = manager;
    manager.location = locationToUpdate;

    const savedLocation = await this.locationsRepository.save(locationToUpdate);
    await this.managersRepository.save(manager);

    /** * CORRECCIÓN DEL ERROR DE TYPESCRIPT:
     * Forzamos el tipo a 'any' momentáneamente para poder eliminar la 
     * propiedad circular sin que TS se queje de que 'manager' podría ser un string.
     */
    const response: any = savedLocation;
    if (response.manager && typeof response.manager === 'object') {
      delete response.manager.location;
    }

    return response;
  }

  return this.locationsRepository.save(locationToUpdate);
}

  remove(id: number) {
    return this.locationsRepository.delete({
      locationId: id,
    });
  }
}
