import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region } from './entities/region.entity';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private regionsRepository: Repository<Region>,
  ){}
  create(createRegionDto: CreateRegionDto) {
    return this.regionsRepository.save(createRegionDto);
  }

  findAll() {
    return this.regionsRepository.find();
  }

  findOne(id: number) {
    const region = this.regionsRepository.findOneBy({
      regionId: id,
    })
    if(!region) throw new NotFoundException('Region not found');
    return region;
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    const regionToUpdate = await this.regionsRepository.preload({
      regionId: id,
      ...updateRegionDto,
    })
    if(!regionToUpdate) throw new BadRequestException();
    return this.regionsRepository.save(regionToUpdate);
  }

  remove(id: number) {
    return this.regionsRepository.delete({
      regionId: id,
    })}
}
