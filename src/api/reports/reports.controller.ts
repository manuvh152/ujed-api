import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseInterceptors, UploadedFiles, ParseFilePipeBuilder, HttpStatus, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto } from './dto';
import { Auth, GetUser } from '../users/decorators';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from '../users/enums/valid-roles.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../../common/helpers/file-filter.helper';
import { maxImageSize, maxVideoSize } from 'src/common/constants/constants';
import { AuthGuard } from '@nestjs/passport';
import { UserAccessGuard } from '../users/guards/user-access.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Auth( ValidRoles.user )
  @UseInterceptors( FilesInterceptor('files', 10, {
    fileFilter: fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 }
  }))
  create(
    @Body() createReportDto: CreateReportDto,
    @GetUser() user: User,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.reportsService.create(createReportDto, user, files);
  }

  @Get()
  @Auth( ValidRoles.admin )
  findAll(@Query() pagination: PaginationDto) {
    return this.reportsService.findAll(pagination);
  }

  @Get(':id/user')
  @UseGuards( AuthGuard(), UserAccessGuard )
  findAllByUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() pagination: PaginationDto
  ){
    return this.reportsService.findAllByUser(id, pagination);
  }

  @Get(':id')
  @Auth()
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.reportsService.findOne(id, user);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string, @Body() updateReportDto: UpdateReportDto,
    @GetUser() user: User
  ) {
    return this.reportsService.update(id, updateReportDto, user);
  }

  @Delete(':id')
  @Auth()
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.reportsService.remove(id, user);
  }
}
