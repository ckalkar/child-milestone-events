import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be a valid hex color code (e.g., #FF6B6B)',
  })
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;
}

