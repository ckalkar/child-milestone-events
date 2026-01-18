import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from '../milestones/entities/milestone.entity';
import { Media } from '../media/entities/media.entity';
import { MediaService } from '../media/media.service';
import { MilestonesService } from '../milestones/milestones.service';
import { CreateBatchUploadDto, BatchMilestoneWithMediaDto } from './dto/batch-item.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BatchService {
  private readonly uploadDir: string;

  constructor(
    @InjectRepository(Milestone)
    private readonly milestoneRepository: Repository<Milestone>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly mediaService: MediaService,
    private readonly milestonesService: MilestonesService,
    private readonly configService: ConfigService,
  ) {
    this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
  }

  private parseBatchData(data: CreateBatchUploadDto | string): CreateBatchUploadDto {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (error) {
        throw new BadRequestException(
          `Invalid JSON in batch data: ${error.message}`,
        );
      }
    }
    return data;
  }

  async uploadBatch(
    files: Express.Multer.File[],
    batchData: CreateBatchUploadDto | string,
  ): Promise<{
    success: boolean;
    totalMilestones: number;
    processedMilestones: number;
    processedMedia: number;
    failures: Array<{ milestone: string; error: string }>;
    milestones: Milestone[];
  }> {
    // Parse batchData if it's a string (from multipart form data)
    const parsedBatchData = this.parseBatchData(batchData);

    const result = {
      success: true,
      totalMilestones: parsedBatchData.milestones.length,
      processedMilestones: 0,
      processedMedia: 0,
      failures: [] as Array<{ milestone: string; error: string }>,
      milestones: [] as Milestone[],
    };

    for (const milestoneData of parsedBatchData.milestones) {
      try {
        // Create milestone
        const milestone = await this.milestonesService.create({
          title: milestoneData.title,
          description: milestoneData.description,
          eventDate: milestoneData.eventDate,
          categoryId: milestoneData.categoryId,
          notes: milestoneData.notes,
          isMajor: milestoneData.isMajor || false,
        });

        result.processedMilestones++;

        // Process media files for this milestone
        if (
          milestoneData.mediaFiles &&
          milestoneData.mediaFiles.length > 0
        ) {
          for (const mediaData of milestoneData.mediaFiles) {
            try {
              const file = files.find(
                (f) => f.originalname === mediaData.filename,
              );
              if (!file) {
                result.failures.push({
                  milestone: milestoneData.title,
                  error: `Media file not found: ${mediaData.filename}`,
                });
                continue;
              }

              // Create media entry
              const media = await this.mediaService.create(file, {
                caption: mediaData.caption,
                takenDate: mediaData.takenDate,
                milestoneId: milestone.id,
              });

              result.processedMedia++;
            } catch (error) {
              result.failures.push({
                milestone: milestoneData.title,
                error: `Failed to process media ${mediaData.filename}: ${error.message}`,
              });
            }
          }
        }

        // Fetch milestone with media
        const milestoneWithMedia = await this.milestoneRepository.findOne({
          where: { id: milestone.id },
          relations: ['category', 'media'],
        });

        result.milestones.push(milestoneWithMedia);
      } catch (error) {
        result.success = false;
        result.failures.push({
          milestone: milestoneData.title,
          error: error.message,
        });
      }
    }

    return result;
  }

  async validateBatchStructure(
    batchData: CreateBatchUploadDto | string,
    files: Express.Multer.File[],
  ): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    // Parse batchData if it's a string (from multipart form data)
    const parsedBatchData = this.parseBatchData(batchData);

    const errors: string[] = [];

    if (!parsedBatchData.milestones || parsedBatchData.milestones.length === 0) {
      errors.push('No milestones provided in batch');
    }

    for (let i = 0; i < parsedBatchData.milestones.length; i++) {
      const milestone = parsedBatchData.milestones[i];

      if (!milestone.title || milestone.title.trim().length === 0) {
        errors.push(`Milestone ${i}: Title is required`);
      }

      if (!milestone.eventDate) {
        errors.push(`Milestone ${i}: Event date is required`);
      } else {
        const date = new Date(milestone.eventDate);
        if (isNaN(date.getTime())) {
          errors.push(`Milestone ${i}: Invalid event date format`);
        }
      }

      if (milestone.mediaFiles && milestone.mediaFiles.length > 0) {
        const fileNames = files.map((f) => f.originalname);

        for (const mediaFile of milestone.mediaFiles) {
          if (!mediaFile.filename) {
            errors.push(
              `Milestone ${i}: Media filename is required for each media file`,
            );
            continue;
          }

          if (!fileNames.includes(mediaFile.filename)) {
            errors.push(
              `Milestone ${i}: Media file not found: ${mediaFile.filename}`,
            );
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  async generateBatchTemplate(): Promise<CreateBatchUploadDto> {
    return {
      milestones: [
        {
          title: 'Sample Milestone',
          description: 'Sample description',
          eventDate: new Date().toISOString().split('T')[0],
          categoryId: 1,
          notes: 'Sample notes',
          isMajor: false,
          mediaFiles: [
            {
              filename: 'image1.jpg',
              caption: 'First photo',
              takenDate: new Date().toISOString().split('T')[0],
            },
          ],
        },
      ],
    };
  }
}
