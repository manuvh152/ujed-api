import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto, UpdateReportDto } from './dto';
import { User } from '../users/entities/user.entity';
import { Report } from './entities/report.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ReportImage } from './entities/report-image.entity';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';

@Injectable()
export class ReportsService {

  private readonly logger = new Logger('ReportsService');

  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(ReportImage)
    private readonly reportImageRepository: Repository<ReportImage>,
    private readonly cloudinaryService: CloudinaryService
  ){}

  async create(createReportDto: CreateReportDto, user: User, files: Express.Multer.File[]) {
    try {
  
      let images: string[];

      (files) ? images = await this.cloudinaryService.uploadFiles(files, 'reportes') : images = [];
      
      const report = this.reportRepository.create({
        ...createReportDto,
        images: (files) ? images.map(image => this.reportImageRepository.create({ url: image })) : [],
        user
      });

      await this.reportRepository.save(report);

      return { ...report, user: user.id }

    } catch (error) {
      console.log(error);
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async uploadImages(id: string, user: User, files: Express.Multer.File[]){
    try {
      
      let images: string[];

      const report = await this.reportRepository.findOne({
        where: { id: id }
      });

      if( report.user.id !== user.id ) return new ForbiddenException().getResponse();

      if( !files ) return new BadRequestException('No files uploaded').getResponse();

      if( files.length + report.images.length > 10 ) return new BadRequestException('Cannot add more than 10 images to a report').getResponse();
      

      images = await this.cloudinaryService.uploadFiles(files, 'reportes');

      const uploadedImages = images.map(image => this.reportImageRepository.create({
        url: image,
        report
      }));
      
      await this.reportImageRepository.save(uploadedImages);
      const urls = uploadedImages.map(image => {
        const { report, ...urls } = image;
        return urls;
      });
      
      return urls;
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      
      const { limit = 20, offset = 0, order } = pagination;

      const reports = await this.reportRepository.find({
        take: limit,
        skip: offset,
        order: {
          updated_at: (order) ? order: 'asc'
        }
      });

      return reports;

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async findAllByUser(id: string, pagination: PaginationDto){
    try {

      const { limit = 20, offset = 0, order } = pagination;

      const reports = await this.reportRepository.find({
        take: limit,
        skip: offset,
        order: {
          updated_at: (order) ? order: 'asc'
        },
        where: { user: { id: id } }
      });

      return reports;

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async findOne(id: string, user: User) {
    try {
    
      const report = await this.reportRepository.findOne({
        where: { id: id }
      });

      if( user.roles.includes('admin') ) return report;

      if( report.user.id !== user.id ) return new ForbiddenException().getResponse();

      return report;

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async update(id: string, updateReportDto: UpdateReportDto, user: User) {
    try {

      const report =  await this.reportRepository.findOne({
        where: { id: id }
      });

      if( !report ) return new NotFoundException('Report not found').getResponse();
      if( report.user.id !== user.id ) return new ForbiddenException().getResponse();

      return await this.reportRepository.update( id, { ...updateReportDto });
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async remove(id: string, user: User) {
    try {

      const report = await this.reportRepository.findOne({
        where: { id: id }
      });

      if( !report ) return await this.reportRepository.delete(id);
      if( report.user.id !== user.id ) return new ForbiddenException().getResponse();

      const images = await this.reportImageRepository.find({
        where: { report: { id: id } }
      });

      const urls: string[] = images.map(image => {
        const imageSplit = image.url.split('/');
        const imageId = imageSplit[7]+'/'+imageSplit[8].split(".")[0];
        return imageId;
      });

      await this.cloudinaryService.deleteFiles(urls);

      return await this.reportRepository.delete(id);
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async updateStatus(id: string, updateStatusDto: UpdateReportStatusDto){
    try {

      const { status } = updateStatusDto;

      const report = await this.reportRepository.findOne({
        where: { id: id }
      });

      if( !report ) return new NotFoundException('Reporte no encontrado').getResponse();

      return await this.reportRepository.update( id, { status: status } )

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async deleteReportImage(id: string, user: User){
    try {

      const image = await this.reportImageRepository.findOne({
        relations: [ 'report' ],
        where: { id: id }
      });
      
      if( !image ) return await this.reportImageRepository.delete(id);

      if( image.report.user.id !== user.id ) return new ForbiddenException().getResponse()

      const imageSplit = image.url.split('/');
      const imageId = imageSplit[7]+'/'+imageSplit[8].split(".")[0];

      await this.cloudinaryService.deleteFile(imageId);
      
      return await this.reportImageRepository.delete(id);

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

}
