import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { OrderBy } from "../enums/order-by.enum";

export class UserPaginationDto extends PaginationDto{

  @IsOptional()
  @IsEnum(OrderBy)
  order_by?: OrderBy;
  
}