import { IsNotEmpty, IsString, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class LocationDto{

  @IsString()
  @IsNotEmpty()
  faculty: string;

  @IsString()
  @IsNotEmpty()
  building: string;

  @IsString()
  @IsNotEmpty()
  classroom: string;

}

export class CreateReportDto {

  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

}
