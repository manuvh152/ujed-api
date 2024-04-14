import { IsEnum, IsOptional } from "class-validator";
import { Departments } from "src/api/reports/enums/departments.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class PermitPaginationDto extends PaginationDto{

  @IsOptional()
  @IsEnum(Departments)
  department?: Departments;

}