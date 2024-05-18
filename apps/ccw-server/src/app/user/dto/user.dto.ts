import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";


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
    @ApiProperty() userLogin: boolean
    @ApiProperty() orgManagerLogin: boolean
    // @ApiProperty()  email: string
    // @ApiProperty() timestamp: string
}

export class ForgotPasswordDto{

    @IsEmail()
    @MaxLength(250)
    @ApiProperty()
    email: string;
  
  }


  export class ForgotPasswordResponseDTO{
    @IsEmail()
    @MaxLength(250)
    @ApiProperty()
    email: string;

    token :string;


  }

  export class UpdatePasswordDto{

    @IsEmail()
    @MaxLength(250)
    @ApiProperty()
    email: string;
  
    @IsNotEmpty()
    @ApiProperty()
    password: string;
  
    @IsNotEmpty()
    @ApiProperty()
    token: string;

    otp: string;
  }
  