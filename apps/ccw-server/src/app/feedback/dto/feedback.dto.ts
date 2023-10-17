import { ApiProperty } from "@nestjs/swagger"

export class FeedbackResponseDto{
    @ApiProperty() id: number
    @ApiProperty() rating: number
    @ApiProperty() feedback: string
    @ApiProperty() authorId: number
}


export class FeedbackCreateDto{
   
    @ApiProperty() rating: number
    @ApiProperty() feedback: string
    @ApiProperty() authorId: number
}