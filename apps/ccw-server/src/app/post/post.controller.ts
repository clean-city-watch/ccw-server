import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import 'multer';

import { FilterPostsResponseDto, PostCreateDto, PostResponseDto } from './dto/post.dto';

import { PostService } from './post.service';

@ApiTags('post')
@Controller('post')
export default class PostController {
    constructor(private postService: PostService){}    
    
    // @ApiOperation({ summary: 'Get post by id' })
    // @ApiResponse({ status: 200, description: 'Success', type: PostResponseDto })
    // @Get(':id')
    // getPostById(@Param('id') id: string): Promise<PostResponseDto> {
    //     return this.postService.post(+id);
    // }
    @ApiOperation({ summary: 'Get all locations' })
    @ApiResponse({ status: 200, description: 'Success',  })
    @Get('/all-locations')
    getallLocations()  {
        return this.postService.getLatLangs();
    }

    @ApiOperation({ summary: 'get posts count' })
    @ApiResponse({ status: 200, description: 'Success' })
    @Get('count')
    getallpostsCount() {
        return this.postService.getPostCount();
    }

    @ApiOperation({ summary: 'get posts count by status' })
    @ApiResponse({ status: 200, description: 'Success' })
    @Get('status/count')
    getallpostsCountbyStatus() {
        return this.postService.getPostCountbyStatus();
    }

    @ApiOperation({ summary: 'Get all posts' })
    @ApiResponse({ status: 200, description: 'Success', type: PostResponseDto })
    @Get()
    getallposts(): Promise<PostResponseDto[]> {
        return this.postService.allpost();
    }

    @ApiOperation({ summary: 'Get posts' })
    @ApiResponse({ status: 200, description: 'Success', type: [PostResponseDto] })
    @Get('feed')
    async getPublishedPosts(): Promise<PostResponseDto[]> {
        return this.postService.posts({});
    }


    
    @ApiOperation({ summary: 'filter post by string' })
    @ApiResponse({ status: 200, description: 'Success', type: [PostResponseDto] })
    @Get('filtered-posts')
    async getFilteredPosts(
        @Query('pageSize') pageSize?: number,
        @Query('pageOffset') pageOffset?: number,
        @Query('city') city?: string,
        @Query('title') title?: string,
        @Query('content') content?: string,
        @Query('userId') userId?: string,
        @Query('self') self?: boolean,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: 'asc' | 'desc'
      ): Promise<FilterPostsResponseDto> {
        return  this.postService.getFilteredPosts(
          +pageSize,
          +pageOffset,
          city,
          title,
          content,
          +userId,
          self,
          sortBy,
          sortOrder
        );
       
      }



    @ApiOperation({ summary: 'Get all posts' })
    @ApiResponse({ status: 200, description: 'Success', type: PostResponseDto })
    @Get(':id')
    getpostbyid(@Param('id') id:number): Promise<PostResponseDto> {
        return this.postService.getpostbyid(+id);
    }


    

    @ApiOperation({ summary: 'get posts status count for user' })
    @ApiParam({ name: 'userid', type: 'string', description: 'Example ID: 1' })
    @ApiResponse({ status: 200, description: 'Success' })
    @Get('status/count/:userid')
    getallpostsCountbyStatusPerUser(@Param('userid') userid:number) {
        return this.postService.getallpostsCountbyStatusPerUser(+userid);
    }

    

    

    // @ApiOperation({ summary: 'filter post by string' })
    // @ApiResponse({ status: 200, description: 'Success', type: [PostResponseDto] })
    // @Get('filtered-posts/:searchString')
    // async getFilteredPosts(
    //     @Param('searchString') searchString: string,
    // ): Promise<PostResponseDto[]> {
    //     return this.postService.posts({
    //     where: {
    //         OR: [
    //         {
    //             title: { contains: searchString },
    //         },
    //         {
    //             content: { contains: searchString },
    //         },
    //         ],
    //     },
    //     });
    // }



    @ApiOperation({ summary: 'Create post' })
    @ApiBody({ type: PostCreateDto })
    // @ApiConsumes('multipart/form-data') // Specify the media type for file upload
    // @UseInterceptors(FileInterceptor('file'))
    @ApiResponse({
        status: 201,
        description: 'Success',
        type: PostResponseDto,
    })
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createDraft(
        @Body() postData: PostCreateDto,
        // @UploadedFile(
        //     new ParseFilePipeBuilder()
        //     .addFileTypeValidator({
        //         fileType: '.(png|jpeg|jpg)',
        //     },)
        //     .addMaxSizeValidator({
        //         maxSize: 1048576 //1Mb
        //     })
        //     .build({
        //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        //     }),
        // )
        // file: Express.Multer.File,
    ): Promise<PostResponseDto> {
        console.log(postData);
        return this.postService.createPost(postData);
      
        // return this.postService.createPost(postData,file);
    }



    @ApiOperation({ summary: 'Update post or publish' })
    @ApiParam({ name: 'id', type: 'string', description: 'Example ID: 1' })
    @ApiResponse({
        status: 201,
        description: 'Success',
        type: PostResponseDto,
    })
    @HttpCode(HttpStatus.CREATED)
    @Put('publish/:id')
    async publishPost(@Param('id') id: string): Promise<PostResponseDto> {
        return this.postService.updatePost({
            where: { id: Number(id) },
            data: { published: true },
        });
    }


    @ApiOperation({ summary: 'Delete post' })
    @ApiParam({ name: 'id', type: 'string', description: 'Example ID: 1' })
    @ApiResponse({ status: 204, description: 'No Content' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('post/:id')
    async deletePost(@Param('id') id: string): Promise<PostResponseDto> {
        return this.postService.deletePost({ id: Number(id) });
      }
}
