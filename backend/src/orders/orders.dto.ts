import {
  IsString,
  IsArray,
  IsNumber,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Nested DTO for each item in the order
export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  @Min(1) // quantity must be at least 1
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  @IsArray()
  // ValidateNested tells class-validator to validate each item in the array
  @ValidateNested({ each: true })
  // @Type tells class-transformer what class to use when transforming each item
  // Without this, nested objects stay as plain objects and validation is skipped
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class PlaceOrderDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}
