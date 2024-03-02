import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { UsersModule } from '../users/users.module';
import { ReportImage } from './entities/report-image.entity';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, ReportImage]),

    UsersModule,

    CloudinaryModule,

    CommonModule
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [TypeOrmModule, ReportsService]
})
export class ReportsModule {}
