import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePaymentDto {
  @IsString()
  brand?: string;

  @IsString()
  last4?: string;

  @IsString()
  expiry?: string;

  @IsString()
  type?: string;
}

export class AddPaymentDto {
  @IsString() @IsNotEmpty() userId: string;
  @IsString() @IsNotEmpty() type: string;
  @IsString() @IsNotEmpty() last4: string;
  @IsString() @IsNotEmpty() brand: string;
  @IsString() @IsNotEmpty() expiry: string;
}
