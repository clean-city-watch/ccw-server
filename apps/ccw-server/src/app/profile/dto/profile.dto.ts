import { ApiProperty } from "@nestjs/swagger";

export class ProfileResponseDto {
    id: number;
    firstName: string;
    LastName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    avatar: string;
    userId: number;
}


export class ProfilePicUploadDto{
    @ApiProperty() id: number
    @ApiProperty() fileName: string
}