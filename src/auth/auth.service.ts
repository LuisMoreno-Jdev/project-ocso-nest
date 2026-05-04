import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Employee } from "src/employees/entities/employee.entity";
import { Manager } from "src/managers/entities/manager.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
    private jwtService: JwtService,
  ) {}

  async registerEmployee(id: string, createUserDto: CreateUserDto) {
    // NUEVA ESTRUCTURA: Validación de roles interna
    const roles = createUserDto.userRoles;
    if (roles.includes("Admin") || roles.includes("Manager")) {
      throw new BadRequestException("Invalid Role");
    }

    // Proceso de guardado
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 5);
    const user = await this.userRepository.save(createUserDto);

    const employeeToUpdate = await this.employeeRepository.preload({
      employeeId: id,
    });

    if (!employeeToUpdate) throw new NotFoundException(`Employee ${id} not found`);

    employeeToUpdate.user = user;
    return this.employeeRepository.save(employeeToUpdate);
  }

  async registerManager(id: string, createUserDto: CreateUserDto) {
    // NUEVA ESTRUCTURA: Un manager no puede auto-asignarse rol de Admin
    const roles = createUserDto.userRoles;
    if (roles.includes("Admin") || roles.includes("Employee")) {
      throw new BadRequestException("Invalid Role");
    }

    createUserDto.password = bcrypt.hashSync(createUserDto.password, 5);
    const user = await this.userRepository.save(createUserDto);

    const managerToUpdate = await this.managerRepository.preload({
      managerId: id,
    });

    if (!managerToUpdate) throw new NotFoundException(`Manager ${id} not found`);

    managerToUpdate.user = user;
    return this.managerRepository.save(managerToUpdate);
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { userEmail: loginUserDto.userEmail },
    });

    if (!user) throw new UnauthorizedException("No estás autorizado");

    const match = await bcrypt.compare(loginUserDto.password, user.password);
    if (!match) throw new UnauthorizedException("No estás autorizado.");

    const payload = {
      userEmail: user.userEmail,
      userRoles: user.userRoles,
    };

    return { token: this.jwtService.sign(payload) };
  }

  async updateUser(userEmail: string, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.userRepository.preload({
      userEmail,
      ...updateUserDto,
    });

    if (!userToUpdate) throw new NotFoundException('User not found');
    
    await this.userRepository.save(userToUpdate);
    return userToUpdate;
  }
}