import { ApiProperty } from "@nestjs/swagger"

export class LogResponseDto{
    @ApiProperty()   id: number;
    @ApiProperty()   userId: number;
    @ApiProperty()   message: string;
    @ApiProperty()   timestamp: Date;
}


export class LogCreateDto{
    @ApiProperty()   userId: number;
    @ApiProperty()   message: string;
}