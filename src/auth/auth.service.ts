import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
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
    private jwtService: JwtService,
  ) {}
  registerUser(createUserDto: CreateUserDto) {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 5);
    return this.userRepository.save(createUserDto);
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        userEmail: loginUserDto.userEmail,
      },
    });
    if (!user) throw new UnauthorizedException("No estas autorizado");
    const match = await bcrypt.compare(loginUserDto.password, user.password);
    if (!match) throw new UnauthorizedException("No estas autorizado.");
    const payload = {
      userEmail: user.userEmail,
      password: user.password,
      userRoles: user.userRoles,
    };
    const token = this.jwtService.sign(payload);
    return {token};
  }

  async updateUser(userEmail: string, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.userRepository.preload({
      userEmail,
      ...updateUserDto,
    })
    if(!userToUpdate) throw new NotFoundException('User not found');
    await this.userRepository.save(userToUpdate);
    return userToUpdate;
  }
}
