import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePermitDto, UpdatePermitDto, PermitPaginationDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permit } from './entities/permit.entity';
import { Repository } from 'typeorm';
import { PermitFile } from './entities/permit-file.entity';
import { Report } from '../reports/entities/report.entity';
import { User } from '../users/entities/user.entity';
import { ReportStatus } from '../reports/enums/report-status.enum';
import { Departments } from '../reports/enums/departments.enum';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';

@Injectable()
export class PermitsService {

  private readonly logger = new Logger('PermitsService');

  constructor(
    @InjectRepository(Permit)
    private readonly permitRepository: Repository<Permit>,
    @InjectRepository(PermitFile)
    private readonly permitFileRepository: Repository<PermitFile>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly cloudinaryService: CloudinaryService
  ){}

  async create(createPermitDto: CreatePermitDto, user: User) {
    try {

      const { report_id, ...permit } = createPermitDto;

      const report = await this.reportRepository.findOne({
        where: { id: report_id }
      });

      if( report.status !== ReportStatus.Asignado ){
        return new ForbiddenException('Report has not been assigned yet').getResponse();
      }

      const newPermit = this.permitRepository.create({
        ...permit,
        report: report,
        user: user,
        department: report.department as Departments
      });

      await this.permitRepository.save(newPermit);
      delete newPermit.user;
      delete newPermit.report;      
      
      return newPermit;

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async findAll(pagination: PermitPaginationDto) {
    try {

      const { limit = 20, offset = 0, order, department } = pagination;
      
      const permits = await this.permitRepository.find({
        take: limit,
        skip: offset,
        order: {
          updated_at: (order) ? order: 'asc'
        },
        where: (department) ? {
          department: department
        } : []
      });

      return permits;

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async findOne(id: string) {
    try {

      const permit = await this.permitRepository.findOne({
        where: { id: id }
      });

      if( !permit ) return new NotFoundException('Permit not found').getResponse();
      
      return permit;

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async update(id: string, updatePermitDto: UpdatePermitDto) {
    try {

      const permit = await this.permitRepository.findOne({
        where: { id: id }
      });

      if( !permit ) return new NotFoundException('Permit not found').getResponse();

      return await this.permitRepository.update( id, { ...updatePermitDto });
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async remove(id: string) {
    try {

      const permit = await this.permitRepository.findOne({
        where: { id: id }
      });

      if( !permit ) return await this.permitRepository.delete(id);

      const files = await this.permitFileRepository.find({
        where: { permit: { id: id } }
      });

      const urls: string[] = files.map(file => {
        const fileSplit = file.url.split('/');
        const fileId = fileSplit[7]+'/'+fileSplit[8].split('.')[0];
        return fileId;
      });

      files.map(async file => {
        await this.permitFileRepository.delete(file.id);
      });

      await this.cloudinaryService.deleteFiles(urls);

      return await this.permitRepository.delete(id);
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async deleteFilePermit(id: string){
    try {

      const file = await this.permitFileRepository.findOne({
        relations: [ 'permits' ],
        where: { id: id }
      });

      if( !file ) return await this.permitFileRepository.delete(id);

      const fileSplit = file.url.split('/');
      const fileId = fileSplit[7]+'/'+fileSplit[8].split('.')[0];

      await this.cloudinaryService.deleteFile(fileId);

      return await this.permitFileRepository.delete(id);
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

}
