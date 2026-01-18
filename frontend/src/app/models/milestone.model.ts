import { Category } from './category.model';
import { Media } from './media.model';

export interface Milestone {
  id: number;
  title: string;
  description?: string;
  eventDate: Date;
  categoryId?: number;
  notes?: string;
  isMajor: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  media?: Media[];
}

export interface CreateMilestoneDto {
  title: string;
  description?: string;
  eventDate: string;
  categoryId?: number;
  notes?: string;
  isMajor?: boolean;
}

export interface UpdateMilestoneDto extends Partial<CreateMilestoneDto> {}

export interface MilestoneStats {
  total: number;
  major: number;
  byCategory: Array<{
    categoryName: string;
    count: number;
  }>;
}

