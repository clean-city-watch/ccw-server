import { ApiProperty } from "@nestjs/swagger"

export class Upvote {
    @ApiProperty() id : number
    @ApiProperty() postId   : number
    @ApiProperty() userId   : number
    @ApiProperty() createdAt : Date
}
