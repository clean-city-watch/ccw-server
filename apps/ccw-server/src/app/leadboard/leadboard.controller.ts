import { LeadboardService } from './leadboard.service';
import {
    Controller,
    Get,
    Param,
    Post,
    Body,
   // Put,
    Delete,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
import { UserResponseDto } from '../user/dto/user.dto';

@ApiTags('leadboard')
@Controller('leadboard')
export class LeadboardController {
    constructor(private readonly leadboardService: LeadboardService) {}



    @ApiOperation({ summary: 'Get all the users for leadboard' })
    @ApiResponse({ status: 200, description: 'Success', type: [UserResponseDto] })    
    @Get()
    async getUsers(){
        return this.leadboardService.getLeadUsers();
    }
}
