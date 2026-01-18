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
  ParseBoolPipe,
} from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  create(@Body() createMilestoneDto: CreateMilestoneDto) {
    return this.milestonesService.create(createMilestoneDto);
  }

  @Get()
  findAll(
    @Query('categoryId') categoryId?: number,
    @Query('isMajor') isMajor?: boolean,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.milestonesService.findAll({
      categoryId,
      isMajor,
      startDate,
      endDate,
    });
  }

  @Get('timeline')
  getTimeline() {
    return this.milestonesService.getTimeline();
  }

  @Get('stats')
  getStats() {
    return this.milestonesService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.milestonesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ) {
    return this.milestonesService.update(id, updateMilestoneDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.milestonesService.remove(id);
  }
}

