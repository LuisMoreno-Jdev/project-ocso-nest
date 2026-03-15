import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  registerUser(createUserDto: CreateUserDto) {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 5);
    return this.userRepository.save(createUserDto);
  }

  async loginUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        userEmail: createUserDto.userEmail,
      },
    });
    if (!user) throw new UnauthorizedException("User or password does not match");
    const match = await bcrypt.compare(createUserDto.password, user.password);
    if (!match) throw new UnauthorizedException("User or password does not match");
    const token = jwt.sign(JSON.stringify(user), "SECRET KEY");
    return token;
  }
}
