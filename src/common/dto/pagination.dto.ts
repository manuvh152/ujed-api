import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsPositive, Min } from "class-validator";
import { Order } from "../enums/order.enum";

export class PaginationDto{

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
  
}