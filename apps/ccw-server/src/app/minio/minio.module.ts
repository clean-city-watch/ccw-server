import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';

@Module({
  providers: [MinioService, ConfigService],
  controllers: [MinioController],
})
export class MinioModule {}
