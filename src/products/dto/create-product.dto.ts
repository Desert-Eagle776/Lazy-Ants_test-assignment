import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsString, Min, MinLength, NotEquals } from "class-validator";

const MIN_LENGTH = 1;

export class CreateProductDto {
  @ApiProperty({ type: String, minLength: MIN_LENGTH })
  @IsString()
  @MinLength(MIN_LENGTH)
  name: string;

  @ApiProperty({ type: String, minLength: MIN_LENGTH })
  @IsString()
  @MinLength(MIN_LENGTH)
  description: string;

  @ApiProperty({ type: Number, minimum: 0 })
  @IsNumber()
  @IsInt()
  @NotEquals(0)
  @Min(0, { message: 'Cost must be a positive number' })
  cost: number;

  @ApiProperty({ type: String, minLength: MIN_LENGTH })
  @IsString()
  @MinLength(MIN_LENGTH)
  category: string;
}