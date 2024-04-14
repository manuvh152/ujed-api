import { IsEnum, IsNumber, IsString, IsUUID, Min, MinLength } from "class-validator";
import { Departments } from "src/api/reports/enums/departments.enum";
import { IsOnlyDate } from "src/common/decorators/is-only-date.decorator";

export class CreatePermitDto {

  @IsString()
  @MinLength(1)
  details: string;

  @IsNumber()
  @Min(0)
  budget: number;

  @IsOnlyDate()
  authorized_time: Date;

  @IsString()
  @IsUUID()
  report_id: string;

}