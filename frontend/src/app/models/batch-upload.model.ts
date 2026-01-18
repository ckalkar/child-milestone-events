export interface BatchMediaFile {
  filename: string;
  caption?: string;
  takenDate?: string;
}

export interface BatchMilestoneData {
  title: string;
  description?: string;
  eventDate: string;
  categoryId?: number;
  notes?: string;
  isMajor?: boolean;
  mediaFiles: BatchMediaFile[];
}

export interface BatchUploadRequest {
  milestones: BatchMilestoneData[];
}

export interface BatchUploadResponse {
  success: boolean;
  summary: {
    totalMilestones: number;
    processedMilestones: number;
    processedMedia: number;
    failureCount: number;
  };
  data: {
    milestones: any[];
  };
  failures: Array<{ milestone: string; error: string }>;
}

export interface BatchValidationResponse {
  valid: boolean;
  errors: string[];
  fileCount: number;
  milestoneCount: number;
}
