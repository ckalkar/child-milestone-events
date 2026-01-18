import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Media } from './entities/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

@Injectable()
export class MediaService {
  private readonly uploadDir: string;
  private readonly allowedImageTypes: string[];
  private readonly allowedVideoTypes: string[];
  private readonly maxFileSize: number;

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly configService: ConfigService,
  ) {
    this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
    this.allowedImageTypes = (
      this.configService.get('ALLOWED_IMAGE_TYPES') ||
      'image/jpeg,image/png,image/gif,image/webp'
    ).split(',');
    this.allowedVideoTypes = (
      this.configService.get('ALLOWED_VIDEO_TYPES') ||
      'video/mp4,video/webm,video/quicktime'
    ).split(',');
    this.maxFileSize =
      (this.configService.get('MAX_FILE_SIZE_MB') || 200) * 1024 * 1024;
  }

  async create(
    file: Express.Multer.File,
    createMediaDto: CreateMediaDto,
  ): Promise<Media> {
    // Validate file
    this.validateFile(file);

    // Determine file type
    const fileType = this.getFileType(file.mimetype);

    // Generate unique filename
    const timestamp = Date.now();
    const uuid = uuidv4();
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}_${uuid}${ext}`;

    // Create directory structure
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const typeDir = fileType === 'image' ? 'images' : 'videos';
    const uploadPath = path.join(this.uploadDir, typeDir, String(year), month);

    await this.ensureDirectoryExists(uploadPath);

    // Save file
    const filePath = path.join(uploadPath, filename);
    await fs.writeFile(filePath, file.buffer);

    // Get image/video metadata
    let width: number | undefined;
    let height: number | undefined;
    let thumbnailPath: string | undefined;

    if (fileType === 'image') {
      const metadata = await sharp(file.buffer).metadata();
      width = metadata.width;
      height = metadata.height;

      // Generate thumbnail
      thumbnailPath = await this.generateThumbnail(
        file.buffer,
        filename,
        year,
        month,
      );
    }

    // Create media entity
    const media = this.mediaRepository.create({
      filename,
      originalFilename: file.originalname,
      filePath: filePath.replace(/\\/g, '/'),
      fileType,
      mimeType: file.mimetype,
      fileSize: file.size,
      width,
      height,
      thumbnailPath: thumbnailPath?.replace(/\\/g, '/'),
      caption: createMediaDto.caption,
      takenDate: createMediaDto.takenDate
        ? new Date(createMediaDto.takenDate)
        : new Date(),
      milestoneId: createMediaDto.milestoneId,
    });

    return await this.mediaRepository.save(media);
  }

  async findAll(params?: {
    milestoneId?: number;
    fileType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Media[]> {
    const query = this.mediaRepository.createQueryBuilder('media')
      .leftJoinAndSelect('media.milestone', 'milestone')
      .orderBy('media.takenDate', 'DESC');

    if (params?.milestoneId !== undefined) {
      if (params.milestoneId === null) {
        query.andWhere('media.milestoneId IS NULL');
      } else {
        query.andWhere('media.milestoneId = :milestoneId', {
          milestoneId: params.milestoneId,
        });
      }
    }

    if (params?.fileType) {
      query.andWhere('media.fileType = :fileType', {
        fileType: params.fileType,
      });
    }

    if (params?.startDate && params?.endDate) {
      query.andWhere('media.takenDate BETWEEN :startDate AND :endDate', {
        startDate: params.startDate,
        endDate: params.endDate,
      });
    }

    return await query.getMany();
  }

  async findOne(id: number): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id },
      relations: ['milestone'],
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return media;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto): Promise<Media> {
    const media = await this.findOne(id);

    Object.assign(media, {
      ...updateMediaDto,
      takenDate: updateMediaDto.takenDate
        ? new Date(updateMediaDto.takenDate)
        : media.takenDate,
    });

    return await this.mediaRepository.save(media);
  }

  async remove(id: number): Promise<void> {
    const media = await this.findOne(id);

    // Delete files
    try {
      await fs.unlink(media.filePath);
      if (media.thumbnailPath) {
        await fs.unlink(media.thumbnailPath);
      }
    } catch (error) {
      console.error('Error deleting files:', error);
    }

    await this.mediaRepository.remove(media);
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    const isImage = this.allowedImageTypes.includes(file.mimetype);
    const isVideo = this.allowedVideoTypes.includes(file.mimetype);

    if (!isImage && !isVideo) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed`,
      );
    }
  }

  private getFileType(mimeType: string): 'image' | 'video' {
    if (this.allowedImageTypes.includes(mimeType)) {
      return 'image';
    }
    return 'video';
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  private async generateThumbnail(
    buffer: Buffer,
    filename: string,
    year: number,
    month: string,
  ): Promise<string> {
    const thumbnailDir = path.join(
      this.uploadDir,
      'thumbnails',
      String(year),
      month,
    );
    await this.ensureDirectoryExists(thumbnailDir);

    const thumbnailPath = path.join(thumbnailDir, filename);

    await sharp(buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    return thumbnailPath;
  }
}

