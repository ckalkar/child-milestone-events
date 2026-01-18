import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFiles,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { BatchService } from './batch.service';
import { CreateBatchUploadDto } from './dto/batch-item.dto';

@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Get('template')
  async getTemplate() {
    const template = await this.batchService.generateBatchTemplate();
    return {
      message: 'Use this structure to prepare your batch upload',
      template,
    };
  }

  @Post('validate')
  @UseInterceptors(
    FilesInterceptor('files', 100, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/temp';
          // Create directory if it doesn't exist
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, uniqueFileName);
        },
      }),
    }),
  )
  async validateBatch(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    try {
      // Extract batchData from body - could be under 'batchData' key or be the whole body
      const batchDataRaw = typeof body === 'object' && body.batchData ? body.batchData : body;
      
      if (!batchDataRaw) {
        throw new BadRequestException('No batch data provided in request body');
      }

      let parsedData: CreateBatchUploadDto;

      // Parse if string, otherwise use as is
      if (typeof batchDataRaw === 'string') {
        parsedData = JSON.parse(batchDataRaw);
      } else if (typeof batchDataRaw === 'object') {
        parsedData = batchDataRaw as CreateBatchUploadDto;
      } else {
        throw new BadRequestException('Batch data must be a valid JSON object');
      }

      const validation = await this.batchService.validateBatchStructure(
        parsedData,
        files,
      );

      return {
        valid: validation.valid,
        errors: validation.errors,
        fileCount: files?.length || 0,
        milestoneCount: parsedData.milestones?.length || 0,
      };
    } catch (error) {
      throw new BadRequestException(
        `Invalid batch data: ${error.message}`,
      );
    }
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 100, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const date = new Date();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const uploadPath = `./uploads/images/${year}/${month}`;
          
          // Create directory if it doesn't exist
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, uniqueFileName);
        },
      }),
    }),
  )
  async uploadBatch(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }

      // Extract batchData from body - could be under 'batchData' key or be the whole body
      const batchDataRaw = typeof body === 'object' && body.batchData ? body.batchData : body;
      
      if (!batchDataRaw) {
        throw new BadRequestException('No batch data provided in request body');
      }

      let parsedData: CreateBatchUploadDto;

      // Parse if string, otherwise use as is
      if (typeof batchDataRaw === 'string') {
        parsedData = JSON.parse(batchDataRaw);
      } else if (typeof batchDataRaw === 'object') {
        parsedData = batchDataRaw as CreateBatchUploadDto;
      } else {
        throw new BadRequestException('Batch data must be a valid JSON object');
      }

      // Validate before processing
      const validation = await this.batchService.validateBatchStructure(
        parsedData,
        files,
      );

      if (!validation.valid) {
        throw new BadRequestException({
          message: 'Batch validation failed',
          errors: validation.errors,
        });
      }

      // Process the batch
      const result = await this.batchService.uploadBatch(files, parsedData);

      return {
        success: result.success,
        summary: {
          totalMilestones: result.totalMilestones,
          processedMilestones: result.processedMilestones,
          processedMedia: result.processedMedia,
          failureCount: result.failures.length,
        },
        data: {
          milestones: result.milestones,
        },
        failures: result.failures,
      };
    } catch (error) {
      throw new BadRequestException(
        `Batch upload failed: ${error.message}`,
      );
    }
  }
}
