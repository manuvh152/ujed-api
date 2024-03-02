import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from 'src/providers/cloudinary/cloudinary.provider';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider ,CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService]
})
export class CloudinaryModule {}
