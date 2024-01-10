import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Request } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbackCreateDto, FeedbackResponseDto } from '../feedback/dto/feedback.dto';
import { LogCreateDto, LogResponseDto } from './dto/log.dto';
import { LogService } from './log.service';




@Controller()
export class LogController {
    constructor(private logService: LogService  ){}

    @ApiTags('log')
    @ApiOperation({ summary: 'Get all logs' })
    @ApiResponse({ status: 200, description: 'Success'})
    @Get('log')
    findAll() {
        return this.logService.findAll();
    }

    @ApiTags('user')
    @ApiOperation({ summary: 'Get all logs for user' })
    @ApiResponse({ status: 200, description: 'Success'})
    @Get('user/log')
    async getLogforUser(@Request() req): Promise<LogResponseDto[]>{
        return this.logService.LogPerUser(req['user'].sub);
    }

    @ApiTags('log')
    @ApiOperation({ summary: 'create log' })
    @ApiBody({ type: LogCreateDto })
    @ApiResponse({
        status: 201,
        description: 'Success',
        type: LogResponseDto,
    })
    @HttpCode(HttpStatus.CREATED)
    @Post('log')
    async createLog(
        @Body() data: LogCreateDto,
    ): Promise<LogResponseDto> {
        return this.logService.createLog(data);
    }


}
