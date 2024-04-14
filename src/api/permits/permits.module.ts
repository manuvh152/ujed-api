import { Module } from '@nestjs/common';
import { PermitsService } from './permits.service';
import { PermitsController } from './permits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permit } from './entities/permit.entity';
import { PermitFile } from './entities/permit-file.entity';
import { ReportsModule } from '../reports/reports.module';
import { UsersModule } from '../users/users.module';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permit, PermitFile]),

    ReportsModule,

    UsersModule,

    CloudinaryModule
  ],
  controllers: [PermitsController],
  providers: [PermitsService],
  exports: [TypeOrmModule]
})
export class PermitsModule {}
