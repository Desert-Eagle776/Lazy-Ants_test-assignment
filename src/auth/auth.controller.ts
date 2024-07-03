import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { IToken } from './interfaces/token.interface';
import { ApiBody, ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }

  @Post('/register')
  @ApiTags('Auth')
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ status: 201, description: 'The record has been successfully created.', type: UserEntity })
  @ApiResponse({ status: 409, description: 'The user with this email is already registered.' })
  register(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.authService.registration(dto);
  }

  @Post('/login')
  @ApiTags('Auth')
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: TokenDto })
  @ApiResponse({ status: 404, description: 'Incorrect email or password.' })
  @ApiResponse({ status: 409, description: 'Incorrect email or password.' })
  login(@Body() dto: LoginUserDto): Promise<IToken> {
    return this.authService.login(dto);
  }
}