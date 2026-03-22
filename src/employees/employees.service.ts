import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';



@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(employee); // Added await
  }

  async uploadPhoto(id: string, file: string) {
    const employee = await this.employeeRepository.findOneBy({ // Added await
        employeeId: id,
    });
    if(!employee) throw new NotFoundException();
    employee.employeePhoto = file;
    await this.employeeRepository.save(employee); // Added await
    return { message: 'Photo uploaded',
      fileName: file,
      employeePhoto: employee.employeePhoto,
    };
  }

  async findAll() {
    return await this.employeeRepository.find(); // Added await
  }

  async findByLocation(id: number) {
    return await this.employeeRepository.findBy({ // Added await
        location: {
          locationId : id
      },
    });
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOneBy({ // Added await
        employeeId: id,
    });
    if(!employee) throw new NotFoundException();
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employeeToUpdate = await this.employeeRepository.preload({
        employeeId: id,
        ...updateEmployeeDto,
    });
    if(!employeeToUpdate) throw new NotFoundException();
    await this.employeeRepository.save(employeeToUpdate); // Added await
    return employeeToUpdate;
  }

  async remove(id: string) {
    await this.employeeRepository.delete({ // Added await
        employeeId: id,
    });
    return { message: 'Employee deleted' };
  }
}