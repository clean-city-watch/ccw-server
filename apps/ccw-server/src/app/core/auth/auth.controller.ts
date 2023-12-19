import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, UserResponseDto, LoginUserResponse } from '../../user/dto/user.dto';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';


@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}

    @Public()
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: 201,
        description: 'Success',
        type: UserResponseDto,
    })
    @HttpCode(HttpStatus.CREATED)
    @Post('signin')
    async signinUser(
        @Body() userData: CreateUserDto,
    ): Promise<LoginUserResponse> {
        return this.authService.loginUser(userData);
    }


    //TODO : put method to change user password or forgot password.

}
