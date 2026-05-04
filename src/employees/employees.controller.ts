import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ROLES } from 'src/auth/constants/roles.constants';
import { ApiAuth } from 'src/auth/decorators/api.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';

@ApiAuth()
@ApiTags('Employees')
@ApiBearerAuth()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Auth(ROLES.Manager)
  @ApiOperation({ summary: 'Create a new employee with an optional photo' })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './src/employees/employees-photos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      },
    })
  }))
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    // Pasamos el DTO y el nombre del archivo (si existe) al servicio
    return this.employeesService.create(createEmployeeDto, file?.filename);
  }

  @Auth(ROLES.Manager, ROLES.Employee)
  @Post('upload/:id')
  @ApiOperation({ summary: 'Upload a photo for an existing employee' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './src/employees/employees-photos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      },
    })
  }))
  uploadPhoto(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.employeesService.uploadPhoto(id, file.filename);
  }

  @Auth(ROLES.Manager)
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Auth(ROLES.Manager)
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.employeesService.findOne(id);
  }

  @Auth(ROLES.Manager)
  @Get('location/:id')
  findAllLocation(@Param('id') id: string) {
    return this.employeesService.findByLocation(+id);
  }

  @Auth(ROLES.Manager, ROLES.Employee)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './src/employees/employees-photos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      },
    })
  }))
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.employeesService.update(id, updateEmployeeDto, file?.filename);
  }

  @Auth(ROLES.Manager)
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.employeesService.remove(id);
  }
}