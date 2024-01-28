import { ApiOperation, ApiProperty } from "@nestjs/swagger";


export class CreateUserDto {
    @ApiProperty() email: string;
    @ApiProperty() password: string;
}

export class UserResponseDto{
    @ApiProperty() id: number
    @ApiProperty()  email: string
    @ApiProperty() timestamp: Date
}

export class LoginUserResponse{
    @ApiProperty() id: string
    @ApiProperty() access_token: string
    @ApiProperty() avatar: string
    // @ApiProperty()  email: string
    // @ApiProperty() timestamp: string
}