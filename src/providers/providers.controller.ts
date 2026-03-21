import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { ROLES } from 'src/auth/constants/roles.constants';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserData } from 'src/auth/decorators/user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProvidersService } from './providers.service';


@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Auth(ROLES.Manager)
  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Auth(ROLES.Employee, ROLES.Manager)
  @Get()
  findAll(@UserData() userData: User) {
    if(userData.userRoles.includes('Employee')) throw new UnauthorizedException('No estás autorizado, solo Admin y Manager');
    return this.providersService.findAll();
  }

  @Auth(ROLES.Employee, ROLES.Manager)
  @Get('/name/:name')
  findByName(@Param('name') name: string){
    return this.providersService.findByName(name);
  }
  
  @Auth(ROLES.Employee, ROLES.Manager)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const provider = this.providersService.findOne(id);
    if(!provider) throw new NotFoundException('Provider not found');
    return provider;
  }

  @Auth(ROLES.Manager)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProviderDto: UpdateProviderDto) {
    return this.providersService.update(id, updateProviderDto);
  }

  @Auth(ROLES.Manager)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providersService.remove(id);
  }
}
