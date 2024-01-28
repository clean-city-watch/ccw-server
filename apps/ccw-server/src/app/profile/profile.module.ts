import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { MinioService } from '../minio/minio.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService,MinioService,ConfigService],
})
export class ProfileModule {}
