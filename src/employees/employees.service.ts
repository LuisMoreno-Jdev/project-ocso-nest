import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import { join } from "path";
import { Repository } from "typeorm";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { Employee } from "./entities/employee.entity";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto, fileName?: string) {
    const employee = this.employeeRepository.create(createEmployeeDto);
    
    // Si se subió una foto en la creación, asignamos el nombre del archivo
    if (fileName) {
      employee.employeePhoto = fileName;
    }
    
    return await this.employeeRepository.save(employee);
  }

  async uploadPhoto(id: string, file: string) {
    const employee = await this.employeeRepository.findOneBy({
      employeeId: id,
    });
    if (!employee) throw new NotFoundException();

    // Borrar foto anterior si existe antes de subir la nueva
    if (employee.employeePhoto) {
      const oldPath = join(__dirname, "..", "..", "src/employees/employees-photos", employee.employeePhoto);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    employee.employeePhoto = file;
    await this.employeeRepository.save(employee);
    return {
      message: "Photo uploaded",
      fileName: file,
      employeePhoto: employee.employeePhoto,
    };
  }

  async findAll() {
    return await this.employeeRepository.find({
      relations: {
        location: true,
        user: true,
      }
    });
  }

  async findByLocation(id: number) {
    return await this.employeeRepository.findBy({
      location: {
        locationId: id,
      },
    });
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: {
        employeeId: id,
      },
      relations: {
        location: true,
        user: true,
      }
    });
    if (!employee) throw new NotFoundException();
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto, fileName?: string) {
    const employeeToUpdate = await this.employeeRepository.preload({
      employeeId: id,
      ...updateEmployeeDto,
    });

    if (!employeeToUpdate)
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);

    if (fileName) {
      if (employeeToUpdate.employeePhoto) {
        const oldPath = join(__dirname, "..", "..", "src/employees/employees-photos", employeeToUpdate.employeePhoto);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      employeeToUpdate.employeePhoto = fileName;
    }

    await this.employeeRepository.save(employeeToUpdate);
    return employeeToUpdate;
  }

  async remove(id: string) {
    const employee = await this.findOne(id);
    
    // Borrar el archivo físico al eliminar al empleado
    if (employee.employeePhoto) {
      const path = join(__dirname, "..", "..", "src/employees/employees-photos", employee.employeePhoto);
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }

    await this.employeeRepository.delete({
      employeeId: id,
    });
    return { message: "Employee deleted" };
  }
}