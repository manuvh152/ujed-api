import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './api/users/users.module';
import { CommonModule } from './common/common.module';
import { ReportsModule } from './api/reports/reports.module';
import { CloudinaryModule } from './utils/cloudinary/cloudinary.module';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { PermitsModule } from './api/permits/permits.module';
import databaseConfig from './config/database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig()),

    UsersModule,

    CommonModule,

    ReportsModule,

    CloudinaryModule,

    PermitsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (configService: ConfigService) => {
        return new TimeoutInterceptor(configService.get<number>('TIMEOUT_IN_MILLISECONDS', 60000))
      },
      inject: [ConfigService]
    }
  ],
})
export class AppModule {}
