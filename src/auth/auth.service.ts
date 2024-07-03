import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { ICreateUser } from './interfaces/create-user.interface';
import { LoginUserDto } from './dto/login.dto';
import { IToken } from './interfaces/token.interface';
import { UserPayload } from './interfaces/user-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) { }

  async registration(dto: CreateUserDto): Promise<UserEntity> {
    const checkUser: UserEntity | null = await this.userRepository.findOneBy({ email: dto.email });
    if (checkUser) {
      throw new HttpException("The user with this email is already registered.", HttpStatus.CONFLICT)
    }

    const hashPassword: string = await argon2.hash(dto.password);

    const createUser: ICreateUser = this.userRepository.create({ ...dto, password: hashPassword });
    const saveUser: UserEntity = await this.userRepository.save(createUser);

    return saveUser;
  }

  async login(dto: LoginUserDto): Promise<IToken> {
    const user: UserEntity = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) {
      throw new HttpException("Incorrect email or password.", HttpStatus.NOT_FOUND);
    }

    const validPassword: boolean = await argon2.verify(user.password, dto.password);
    if (!validPassword) {
      throw new HttpException("Incorrect email or password.", HttpStatus.CONFLICT);
    }

    const token: IToken = await this.generateToken(user);
    return token;
  }

  private async generateToken(user: UserEntity): Promise<IToken> {
    const payload: UserPayload = { user_id: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
    };
  }

}
