import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobResponseDto } from './dto/job-response.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('process')
  @HttpCode(HttpStatus.OK)
  async processJob(@Body() createJobDto: CreateJobDto): Promise<JobResponseDto> {
    return this.jobsService.processJob(createJobDto);
  }

  @Get('recent')
  getRecentJobs() {
    return this.jobsService.getRecentJobs();
  }
}
