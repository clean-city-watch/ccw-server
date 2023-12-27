import { Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../core/auth/public.decorator';
import { MinioService } from './minio.service';

@ApiTags('minio')
@Controller('minio')
export class MinioController {
    constructor(private readonly minioService: MinioService) {}

    @Public()
    @Post('covers')
    @UseInterceptors(FileInterceptor('file'))
    async uploadBookCover(@UploadedFile() file: Express.Multer.File) {
      console.log('request reached here...');
      await this.minioService.createBucketIfNotExists()
      const fileName = await this.minioService.uploadFile(file)
      return fileName
    }
  
    @Public()
    @Get('covers/:fileName')
    async getBookCover(@Param('fileName') fileName: string) {
      const fileUrl = await this.minioService.getFileUrl(fileName)
      return fileUrl
    }
  
    @Public()
    @Delete('covers/:fileName')
    async deleteBookCover(@Param('fileName') fileName: string) {
      await this.minioService.deleteFile(fileName)
      return fileName
    }


}
