import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto){
    // save() is async, it must be awaited
    return await this.productRepository.save(createProductDto); 
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: string) {
    const productFound = await this.productRepository.findOneBy({ // Added await
      productId: id,
    });
    if(!productFound) throw new NotFoundException();
    return productFound;
  }

  async findByProvider(id: string) {
    return await this.productRepository.findBy({ // Added await
      provider: { providerId: id }
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const productToUpdate = await this.productRepository.preload({
      productId: id,
      ...updateProductDto,
    });
    if(!productToUpdate) throw new NotFoundException();
    await this.productRepository.save(productToUpdate); // Added await
    return productToUpdate;
  }

  async remove(id: string) {
    await this.productRepository.delete({ // Added await
      productId: id,
    });
    return { message: `Objeto con id ${id} eliminado` };
  }
}