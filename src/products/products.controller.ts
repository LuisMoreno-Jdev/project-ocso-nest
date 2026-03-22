import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ROLES } from 'src/auth/constants/roles.constants';
import { ApiAuth } from 'src/auth/decorators/api.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiAuth()
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Auth(ROLES.Manager, ROLES.Employee)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Auth(ROLES.Employee, ROLES.Manager)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }
  
  @Auth(ROLES.Employee, ROLES.Manager)
  @Get('provider/:id')
  findByProvider(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.productsService.findByProvider(id);
  }
  
  @Auth(ROLES.Employee, ROLES.Manager)
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.productsService.findOne(id);
  }
  
  @Auth(ROLES.Employee, ROLES.Manager)
  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe({version: '4'})) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }
  
  @Auth(ROLES.Manager)
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.productsService.remove(id);
  }
}
