import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { generateRandomEmail } from '../utils/utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { IToken } from './interfaces/token.interface';

dotenv.config();

describe('AuthController', () => {
  let controller: AuthController;
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
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  afterEach(async () => {
    await repository.clear(); // self-cleaning "users" table after tests
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the newly registered user', async () => {
    const email: string = generateRandomEmail();
    const dto: CreateUserDto = { email, name: 'Test', password: 'password' };

    const user: UserEntity = await controller.register(dto);

    expect(user).toEqual({ id: user.id, ...dto, password: user.password });
  });

  it('should return a token if the user successfully logged in', async () => {
    const email: string = generateRandomEmail();
    const password: string = 'password';

    const createUserDto: CreateUserDto = { email, password, name: 'Test' };
    const loginUserDto: LoginUserDto = { email, password };

    await controller.register(createUserDto);
    const loginUser: IToken = await controller.login(loginUserDto);

    expect(loginUser).toMatchObject<IToken>({
      token: expect.any(String),
    });
  });
});
