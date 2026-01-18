import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
  MaxLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BatchMediaDto {
  @IsString()
  filename: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsDateString()
  takenDate?: string;
}

export class BatchMilestoneWithMediaDto {
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchMediaDto)
  mediaFiles: BatchMediaDto[];
}

export class CreateBatchUploadDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchMilestoneWithMediaDto)
  milestones: BatchMilestoneWithMediaDto[];
}
