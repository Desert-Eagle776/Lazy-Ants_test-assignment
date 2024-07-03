import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

const MIN_LENGTH = 1;

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(MIN_LENGTH)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(MIN_LENGTH)
  password: string;
}