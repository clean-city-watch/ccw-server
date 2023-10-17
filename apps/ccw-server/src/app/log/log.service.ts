import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LogCreateDto, LogResponseDto } from './dto/log.dto';

@Injectable()
export class LogService {

    private prismaService = new PrismaClient()

    findAll(){
        return this.prismaService.log.findMany({});
    }

    async LogPerUser(userId: number){
        return this.prismaService.log.findMany({
            where: {
                userId: Number(userId)
            }
        })
    }


    async createLog(body: LogCreateDto): Promise<LogResponseDto>{
        const log  = await this.prismaService.log.create({
            data:{
                userId: Number(body.userId),
                message: body.message
            }
        })
        if(!log) throw new HttpException("Error in log creation", HttpStatus.NOT_ACCEPTABLE);
        return log

    }
}
