import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiTags, ApiBody } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { AuthGuard } from '../core/auth/auth.guard';
import { RolesGuard } from '../core/auth/roles.guard';
import { Roles } from '../core/auth/roles.decorator';
import { Role } from '../core/auth/roles.enum';
import { Public } from '../core/auth/public.decorator';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Create comment' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Success',
      type: Comment,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentService.create(createCommentDto, req['user'].sub);
  }

  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: 200, description: 'Success', type: [Comment] })
  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @ApiOperation({ summary: 'Get comment by Post id' })
  @ApiResponse({ status: 200, description: 'Success', type: Comment })
  @Get(':postid')
  allCommentsforPost(@Param('postid') id: string) {
    return this.commentService.allCommentsforPost(+id);
  }

  @ApiOperation({ summary: 'Get comment by id' })
  @ApiResponse({ status: 200, description: 'Success', type: Comment })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }


  @ApiOperation({ summary: 'Update comment' })
  @ApiParam({ name: 'id', type: 'number', description: 'Example ID: 1' })
  @ApiResponse({
      status: HttpStatus.ACCEPTED,
      description: 'Success',
      type: Comment,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }


  @ApiOperation({ summary: 'Delete comment' })
  @ApiParam({ name: 'id', type: 'string', description: 'Example ID: 1' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No Content' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
