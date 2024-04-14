import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ReportStatus } from "../enums/report-status.enum";

export class ReportPaginationDto extends PaginationDto{

  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

}