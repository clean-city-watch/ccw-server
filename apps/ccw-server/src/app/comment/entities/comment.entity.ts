import { ApiProperty } from "@nestjs/swagger"

export class Comment {
    @ApiProperty() id : number
    @ApiProperty() postId   : number
    @ApiProperty() userId   : number
    @ApiProperty() content   :string
    @ApiProperty() createdAt : Date
}
