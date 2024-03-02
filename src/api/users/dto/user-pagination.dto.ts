import { IsEnum, IsOptional, IsPositive, Min } from "class-validator";
import { Type } from "class-transformer";
import { Order } from "src/common/enums/order.enum";
import { OrderBy } from "../enums/order-by.enum";

export class UserPaginationDto{

  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type( () => Number )
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type( () => Number )
  offset?: number;

  @IsOptional()
  @IsEnum(Order)
  order?: Order;

  @IsOptional()
  @IsEnum(OrderBy)
  order_by?: OrderBy;
  
}