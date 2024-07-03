import * as dotenv from "dotenv";
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { generateRandomEmail } from '../utils/utils';
import { IToken } from './interfaces/token.interface';
import { LoginUserDto } from './dto/login.dto';
import { JwtModule } from "@nestjs/jwt";

dotenv.config();

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '24h' }
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          username: process.env.POSTGRES_USER,
          database: process.env.POSTGRES_TEST_DB,
          password: process.env.POSTGRES_PASSWORD,
          entities: [UserEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([UserEntity])
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  afterEach(async () => {
    await repository.clear(); // self-cleaning "users" table after tests
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register the user', async () => {
    const email: string = generateRandomEmail();
    const dto: CreateUserDto = { email, name: 'Test', password: 'password' };
    const user: UserEntity = await service.registration(dto);

    expect(user).toMatchObject<UserEntity>({
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.any(String),
      password: expect.any(String)
    });
  });

  it('should log the user in and return the login token', async () => {
    const email: string = generateRandomEmail();
    const password: string = 'password';
    const createUserDto: CreateUserDto = { email, password, name: 'Test' };
    const loginUserDto: LoginUserDto = { email, password };

    await service.registration(createUserDto);
    const login: IToken = await service.login(loginUserDto);

    expect(login).toMatchObject<IToken>({
      token: expect.any(String),
    });
  });
});
