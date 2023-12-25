import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from '../minio/minio.service';
import PostController from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService, MinioService,ConfigService],
})
export class PostModule {}
