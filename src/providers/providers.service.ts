import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';


@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
  ){}

  async create(createProviderDto: CreateProviderDto) {
    const provider = this.providerRepository.create(createProviderDto);
    return await this.providerRepository.save(provider);
  }

  findAll() {
    return this.providerRepository.find();
  }

  findByName(name: string) {
    const provider = this.providerRepository.findBy({
        providerName: Like(`%${name}%`),
    })
    if(!provider) throw new NotFoundException('Provider not found');
    return provider;
  }

  findOne(id: string) {
    const provider = this.providerRepository.findOneBy({
      providerId: id,
    })
    if(!provider) throw new NotFoundException('Provider not found');
    return provider;
  }

  async update(id: string, updateProviderDto: UpdateProviderDto) {
    const providerToUpdate = await this.providerRepository.preload({
      providerId: id,
      ...updateProviderDto,
    })
    if(!providerToUpdate) throw new NotFoundException('Provider not found');
    return this.providerRepository.save(providerToUpdate);
  }

  remove(id:  string) {
    this.providerRepository.delete({
      providerId: id,
    })
  }
}
