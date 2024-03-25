import { IsEnum } from "class-validator";
import { Departments } from "../enums/departments.enum";

export class UpdateReportDepartmentDto{
  
  @IsEnum(Departments)
  department: Departments;

}