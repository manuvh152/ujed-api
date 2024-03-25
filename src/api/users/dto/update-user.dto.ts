import { IsString, MinLength } from "class-validator";

export class UpdateUserDto{

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  last_name: string;

}