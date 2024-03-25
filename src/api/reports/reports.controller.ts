import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseInterceptors, UploadedFiles, Res, InternalServerErrorException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto } from './dto';
import { Auth, GetUser, UserAccess } from '../users/decorators';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from '../users/enums/valid-roles.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { fileFilter } from '../../common/helpers/file-filter.helper';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { maxFileSize } from 'src/common/constants/constants';
import { UpdateReportDepartmentDto } from './dto/update-report-department.dto';
import { PdfService } from 'src/common/pdf/pdf.service';
import * as fs from 'fs';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly pdfService: PdfService
  ) {}

  @Post()
  @Auth()
  @UseInterceptors( FilesInterceptor('files', 10, {
    fileFilter: fileFilter,
    limits: { fileSize: maxFileSize }
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
    limits: { fileSize: maxFileSize }
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

  @Patch(':id/department')
  @Auth( ValidRoles.admin )
  updateDepartment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() department: UpdateReportDepartmentDto
  ){
    return this.reportsService.updateDepartment(id, department);
  }

  @Delete(':id/image')
  @Auth()
  deleteImage(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ){
    return this.reportsService.deleteReportImage(id, user);
  }

  @Get('pdf/nest')
  async ajua(@Res() res: Response){
    const buffer = await this.pdfService.pdfTest();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-disposition': 'attachment; filename=report.pdf',
      'Content-Lenght': buffer.length
    });

    res.send(buffer);
  }

}
