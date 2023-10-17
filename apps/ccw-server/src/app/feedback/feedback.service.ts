import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { FeedbackCreateDto, FeedbackResponseDto } from './dto/feedback.dto';

@Injectable()
export class FeedbackService {
    private prismaService = new PrismaClient()

    findAll(){
        return this.prismaService.userFeedBack.findMany({});
    }


    async giveFeedback(body: FeedbackCreateDto): Promise<FeedbackResponseDto>{
        const feedback  = await this.prismaService.userFeedBack.create({
            data: {
                rating : Number(body.rating),
                feedback: body.feedback,
                authorId: Number(body.authorId)
            }
        })
        if(!feedback) throw new HttpException("Error in feedback creation", HttpStatus.NOT_ACCEPTABLE);
        return feedback

    }
}
