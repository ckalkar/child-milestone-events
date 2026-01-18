import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateMediaDto {
  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsDateString()
  takenDate?: string;

  @IsOptional()
  @IsNumber()
  milestoneId?: number;
}

