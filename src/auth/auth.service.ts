import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
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

  // LÓGICA PARA EMPLEADOS (Como la del profe pero con validación de tipos)
  async registerEmployee(id: string, createUserDto: CreateUserDto) {
    // Hasheamos usando el nombre de tu campo 'password'
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 5);
    
    // Guardamos el usuario
    const user = await this.userRepository.save(createUserDto);

    // Preparamos la entidad Employee
    const employeeToUpdate = await this.employeeRepository.preload({
      employeeId: id,
    });

    // Guardrail: Evita el error de "possibly undefined"
    if (!employeeToUpdate) throw new NotFoundException(`Employee ${id} not found`);

    // Vinculamos y guardamos en el repositorio de empleados
    employeeToUpdate.user = user;
    return this.employeeRepository.save(employeeToUpdate);
  }

  // LÓGICA PARA MANAGERS (Replicando la segunda parte de la imagen)
  async registerManager(id: string, createUserDto: CreateUserDto) {
    // 1. Hashear password
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 5);

    // 2. Crear el registro en la tabla User
    const user = await this.userRepository.save(createUserDto);

    // 3. Buscar al manager por ID para actualizarlo
    const managerToUpdate = await this.managerRepository.preload({
      managerId: id,
    });

    // 4. Validar que exista para que TS no marque error
    if (!managerToUpdate) throw new NotFoundException(`Manager ${id} not found`);

    // 5. Vincular al usuario y guardar en el repositorio de MANAGERS
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