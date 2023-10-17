import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {  FeedbackCreateDto, FeedbackResponseDto } from './dto/feedback.dto';
import { FeedbackService } from './feedback.service';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
    constructor(private feedbackService: FeedbackService  ){}

    @ApiOperation({ summary: 'Get all feedbacks' })
    @ApiResponse({ status: 200, description: 'Success'})
    @Get()
    findAll() {
        return this.feedbackService.findAll();
    }

    @ApiOperation({ summary: 'give feedback' })
    @ApiBody({ type: FeedbackCreateDto })
    @ApiResponse({
        status: 201,
        description: 'Success',
        type: FeedbackResponseDto,
    })
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async giveFeedback(
        @Body() data: FeedbackCreateDto,
    ): Promise<FeedbackResponseDto> {
        return this.feedbackService.giveFeedback(data);
    }

}
