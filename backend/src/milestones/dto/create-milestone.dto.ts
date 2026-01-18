import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateMilestoneDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  eventDate: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isMajor?: boolean;
}

