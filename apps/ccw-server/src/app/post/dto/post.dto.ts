import { ApiProperty } from "@nestjs/swagger"


// export class PostFindManyDto{
//     skip?: number;
//     take?: number;
//     cursor?: Prisma.PostWhereUniqueInput;
//     where?: Prisma.PostWhereInput;
//     orderBy?: Prisma.PostOrderByWithRelationInput;
// }

export class PostCreateDto{
    @ApiProperty() title: string;
    @ApiProperty() content?: string;
    // @ApiProperty({ type: 'string', format: 'binary' }) file: Express.Multer.File;
    @ApiProperty() city: string;
    @ApiProperty() published?: boolean;
    @ApiProperty() latitude : string;   
    @ApiProperty() longitude : string;  
    @ApiProperty() authorId: number;
}

export class PostResponseDto{
    @ApiProperty() id: number
    @ApiProperty() title: string
    @ApiProperty() content: string;
    @ApiProperty() city: string;
    @ApiProperty() imageUrl: string
    @ApiProperty() latitude : number;   
    @ApiProperty() longitude : number; 
    @ApiProperty() published: boolean
    @ApiProperty() timestamp: Date
    @ApiProperty() authorId: number
}

export class FilterPostsResponseDto{
    @ApiProperty() size: number
    @ApiProperty() number: number
    @ApiProperty() total: number
    @ApiProperty() sort: [
        {
            by: string,
            order: string
        }
    ]
    @ApiProperty() content: PostResponseDto[]
}