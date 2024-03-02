import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { ReportStatus } from "../enums/report-status.enum";

export class CreateReportDto {

  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsEnum(ReportStatus)
  @IsOptional()
  status?: ReportStatus;

}
