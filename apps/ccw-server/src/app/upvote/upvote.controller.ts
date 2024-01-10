import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UpvoteService } from './upvote.service';
import { CreateUpvoteDto } from './dto/create-upvote.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Upvote } from './entities/upvote.entity';


@ApiTags('upvote')
@Controller('upvote')
export class UpvoteController {
  constructor(private readonly upvoteService: UpvoteService) {}
  

  @ApiOperation({ summary: 'Create upvote' })
  @ApiBody({ type: CreateUpvoteDto })
  @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Success',
      type: Upvote,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createUpvoteDto: CreateUpvoteDto, @Request() req) {
    return this.upvoteService.create(createUpvoteDto, req['user'].sub);
  }




  @ApiOperation({ summary: 'Get all upvotes' })
  @ApiResponse({ status: 200, description: 'Success', type: [Upvote] })
  @Get()
  findAll() {
    return this.upvoteService.findAll();
  }


  @ApiOperation({ summary: 'Get upvotes' })
  @ApiResponse({ status: 200, description: 'Success', type: Upvote })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.upvoteService.findOne(+id);
  }

  
  @ApiOperation({ summary: 'Delete upvote' })
  @ApiParam({ name: 'id', type: 'string', description: 'Example ID: 1' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No Content' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.upvoteService.remove(+id);
  }
}
