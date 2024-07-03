import { ApiProperty } from "@nestjs/swagger";
import { IToken } from "../interfaces/token.interface";

export class TokenDto implements IToken {
  @ApiProperty()
  token: string;
}