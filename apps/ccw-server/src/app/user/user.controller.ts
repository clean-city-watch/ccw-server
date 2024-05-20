import {
    Controller,
    Get,
    Param,
    Post,
    Body,
   // Put,
    Request,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    Put,
  } from '@nestjs/common';
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, ForgotPasswordDto, ForgotPasswordResponseDTO, LoginUserResponse, UpdatePasswordDto, UserResponseDto } from './dto/user.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { AuthGuard } from '../core/auth/auth.guard';
import { RolesGuard } from '../core/auth/roles.guard';
import { Roles } from '../core/auth/roles.decorator';
import { Role } from '../core/auth/roles.enum';
import { Public } from '../core/auth/public.decorator';



@ApiTags('user')
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}
    

    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.ADMIN,Role.VIEWER)
    @ApiOperation({ summary: 'Get all the users' })
    @ApiResponse({ status: 200, description: 'Success', type: [UserResponseDto] })    
    @Get('all-users')
    async getUsers(): Promise<UserResponseDto[]>{
        return this.userService.users({});
    }

    @ApiOperation({ summary: 'Get user count ' })
    @ApiResponse({ status: 200, description: 'Success' })
    @Get('user/count')
    async getCount(){
        return this.userService.getCount();
    }

    
    @ApiOperation({ summary: 'Get user by id' })
    @ApiParam({ name: 'id', type: 'string', description: 'Example ID: 1' })
    @ApiResponse({ status: 200, description: 'Success', type: UserResponseDto })
    @Get('user/:id')
    async getUserById(@Param('id') id:number): Promise<UserResponseDto>{
        return this.userService.user(+id);
    }

    @ApiOperation({ summary: 'Get all count by id' })
    @ApiResponse({ status: 200, description: 'Success' })
    @Get('user/activity/count')
    async getAllCount(@Request() req){
        return this.userService.getAllCount(req['user'].sub);
    }

    @Public()
    @ApiOperation({ summary: 'Create user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: 201,
        description: 'Success',
        type: UserResponseDto,
    })
    @HttpCode(HttpStatus.CREATED)
    @Post('user/signup')
    async signupUser(
        @Body() userData: CreateUserDto,
    ): Promise<UserResponseDto> {
        return this.userService.createUser(userData);
    }


    @ApiOperation({ summary: 'Delete user' })
    @ApiParam({ name: 'id', type: 'string', description: 'Example ID: 1' })
    @ApiResponse({ status: 204, description: 'No Content' })
    @Delete('user/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser({id:Number(id)})
    }

    @Public()
    @Post('forgot-password')
    @ApiOkResponse({ type: ForgotPasswordResponseDTO })
    @HttpCode(HttpStatus.OK)
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
        return this.userService.forgotPassword(forgotPasswordDto);
    }


    @Public()
    @Put('update-password/email/:emailId/token/:token')
    @ApiOkResponse({ type: UserResponseDto })
    @HttpCode(HttpStatus.CREATED)
    updatePassword(@Body() updatePasswordDto: UpdatePasswordDto){
        return this.userService.updatePassword(updatePasswordDto);
    }

//https://youtu.be/qlELLikT3FU

// get user's current location and then give them the route for destination.
// https://blog.logrocket.com/react-native-geolocation-complete-tutorial/

}
