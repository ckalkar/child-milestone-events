import { Milestone } from './milestone.model';

export interface Media {
  id: number;
  filename: string;
  originalFilename: string;
  filePath: string;
  fileType: 'image' | 'video';
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
  caption?: string;
  takenDate?: Date;
  thumbnailPath?: string;
  milestoneId?: number;
  createdAt: Date;
  updatedAt: Date;
  milestone?: Milestone;
}

export interface CreateMediaDto {
  caption?: string;
  takenDate?: string;
  milestoneId?: number;
}

export interface UpdateMediaDto extends Partial<CreateMediaDto> {}

