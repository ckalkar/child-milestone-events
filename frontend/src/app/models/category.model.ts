export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

