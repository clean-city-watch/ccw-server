import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfilePicUploadDto, ProfileResponseDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService){}

    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'Success', type: ProfileResponseDto })    
    @Get(':id')
    async getUsers(@Param('id') id: string): Promise<ProfileResponseDto>{
        return this.profileService.getProfile(+id);
    }


    @ApiOperation({ summary: 'Edit profile' })
    @ApiBody({ type: ProfileResponseDto })
    @ApiResponse({
        status: 202,
        description: 'Success',
        type: ProfileResponseDto,
    })
    @HttpCode(HttpStatus.ACCEPTED)
    @Post('edit')
    async editProfile(
        @Body() data: ProfileResponseDto,
    ): Promise<ProfileResponseDto> {
        return this.profileService.editProfile(data);
    }



    @ApiOperation({ summary: 'Edit profile pic' })
    @UseInterceptors(FileInterceptor('file'))
    @ApiBody({ type: ProfileResponseDto })
    @ApiResponse({
        status: 202,
        description: 'Success',
        type: ProfileResponseDto,
    })
    @HttpCode(HttpStatus.ACCEPTED)
    @Put('pic/edit')
    async editProfilePic(
        @Body() profilePicUploadDto: ProfilePicUploadDto,
        @UploadedFile() file?: Express.Multer.File,
    ): Promise<ProfileResponseDto> {
        return this.profileService.editProfilePic(file, profilePicUploadDto)
        
    }

}
