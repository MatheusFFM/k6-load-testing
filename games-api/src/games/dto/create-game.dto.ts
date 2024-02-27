import { IsString, IsOptional, Min, IsNumber } from 'class-validator';

export class CreateGameDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;
}
