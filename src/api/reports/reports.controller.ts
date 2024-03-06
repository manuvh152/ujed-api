import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseInterceptors, UploadedFiles, ParseFilePipeBuilder, HttpStatus, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto } from './dto';
import { Auth, GetUser, UserAccess } from '../users/decorators';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from '../users/enums/valid-roles.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { fileFilter } from '../../common/helpers/file-filter.helper';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Auth()
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

  @Post(':id/images')
  @Auth()
  @UseInterceptors( FilesInterceptor('files', 10, {
    fileFilter: fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 }
  }))
  uploadImages(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @UploadedFiles() files: Express.Multer.File[]
  ){
    return this.reportsService.uploadImages(id, user, files);
  }

  @Get()
  @Auth( ValidRoles.admin )
  findAll(@Query() pagination: PaginationDto) {
    return this.reportsService.findAll(pagination);
  }

  @Get(':id/user')
  @UserAccess( ValidRoles.admin )
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

  @Patch(':id/status')
  @Auth( ValidRoles.admin )
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() status: UpdateReportStatusDto
  ){
    return this.reportsService.updateStatus(id, status);
  }

  @Delete(':id/image')
  @Auth()
  deleteImage(
    @Param('id') id: string,
    @GetUser() user: User
  ){
    return this.reportsService.deleteReportImage(id, user);
  }

}
