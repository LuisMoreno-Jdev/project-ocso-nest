import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ROLES } from 'src/auth/constants/roles.constants';
import { ApiAuth } from 'src/auth/decorators/api.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';

@ApiAuth()
@ApiTags('Employees')
@ApiBearerAuth()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Auth(ROLES.Manager)
  @ApiResponse({
    status: 201,
    example: {
      employeeId: "UUID",
      employeeName: "Luis",
      employeeLastName: "Moreno",
      employeePhoneNumber: "4425682341",
    }as Employee
  })
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Auth(ROLES.Manager, ROLES.Employee)
  @Post('upload/:id')
  @ApiOperation({summary: 'Upload a photo for an employee'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    example: {
      message: "Ok",
    }
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './src/employees/employees-photos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const fileName = `${uniqueSuffix}${ext}`;
        cb(null, fileName);
      },
    })
  }))
  uploadPhoto(@Param('id', new ParseUUIDPipe({version: '4'})) id: string,
    @UploadedFile() file: Express.Multer.File,
){
    return this.employeesService.uploadPhoto(id, file.filename);
  }
  
  @Auth(ROLES.Manager)
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Auth(ROLES.Manager)
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
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
    @Param('id', new ParseUUIDPipe({version: '4'})) id: string, 
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFile() file?: Express.Multer.File // El archivo ahora es opcional aquí
  ) {
    // Si viene un archivo, pasamos su nombre, si no, undefined
    return this.employeesService.update(id, updateEmployeeDto, file?.filename);
  }
  
  @Auth(ROLES.Manager)
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.employeesService.remove(id);
  }
}
