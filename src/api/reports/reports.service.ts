import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto, UpdateReportDto } from './dto';
import { User } from '../users/entities/user.entity';
import { Report } from './entities/report.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ReportImage } from './entities/report-image.entity';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';

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

      return await this.reportRepository.delete(id);
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }
}
