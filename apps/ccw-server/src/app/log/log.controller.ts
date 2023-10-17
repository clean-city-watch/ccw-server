import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbackCreateDto, FeedbackResponseDto } from '../feedback/dto/feedback.dto';
import { LogCreateDto, LogResponseDto } from './dto/log.dto';
import { LogService } from './log.service';



@ApiTags('log')
@Controller('log')
export class LogController {
    constructor(private logService: LogService  ){}

    @ApiOperation({ summary: 'Get all logs' })
    @ApiResponse({ status: 200, description: 'Success'})
    @Get()
    findAll() {
        return this.logService.findAll();
    }

    @ApiOperation({ summary: 'Get all logs for user' })
    @ApiResponse({ status: 200, description: 'Success'})
    @Get(':userid')
    async getLogforUser(@Param('userid') userid: number): Promise<LogResponseDto[]>{
        return this.logService.LogPerUser(+userid);
    }

    @ApiOperation({ summary: 'create log' })
    @ApiBody({ type: LogCreateDto })
    @ApiResponse({
        status: 201,
        description: 'Success',
        type: LogResponseDto,
    })
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createLog(
        @Body() data: LogCreateDto,
    ): Promise<LogResponseDto> {
        return this.logService.createLog(data);
    }


}
