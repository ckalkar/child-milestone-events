import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMediaDto: CreateMediaDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.mediaService.create(file, createMediaDto);
  }

  @Get()
  findAll(
    @Query('milestoneId') milestoneId?: number,
    @Query('fileType') fileType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.mediaService.findAll({
      milestoneId,
      fileType,
      startDate,
      endDate,
    });
  }

  @Get('gallery')
  getGallery(@Query('fileType') fileType?: string) {
    // Get standalone media (not linked to milestones)
    return this.mediaService.findAll({
      milestoneId: null,
      fileType,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMediaDto: UpdateMediaDto,
  ) {
    return this.mediaService.update(id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.remove(id);
  }
}

