import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@prisma/client';

// export class PostFindManyDto{
//     skip?: number;
//     take?: number;
//     cursor?: Prisma.PostWhereUniqueInput;
//     where?: Prisma.PostWhereInput;
//     orderBy?: Prisma.PostOrderByWithRelationInput;
// }

export class PostCreateDto {
  @ApiProperty() title: string;
  @ApiProperty() content?: string;
  @ApiProperty() city: string;
  @ApiProperty() published?: boolean;
  @ApiProperty() latitude?: string;
  @ApiProperty() longitude?: string;
  @ApiProperty() authorId: number;
  @ApiProperty() type: PostType;
  @ApiProperty() question?: string;
  @ApiProperty() pollOptions?: string[];
  @ApiProperty() organizationId?: number;
  @ApiProperty() communityId?: number;
}

export class PostResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() title: string;
  @ApiProperty() content: string;
  @ApiProperty() city: string;
  @ApiProperty() imageUrl: string;
  @ApiProperty() latitude: number;
  @ApiProperty() longitude: number;
  @ApiProperty() published: boolean;
  @ApiProperty() timestamp: Date;
  @ApiProperty() authorId: number;
}

export class FilterPostsResponseDto {
  @ApiProperty() size: number;
  @ApiProperty() number: number;
  @ApiProperty() total: number;
  @ApiProperty() sort: [
    {
      by: string;
      order: string;
    }
  ];
  @ApiProperty() content: PostResponseDto[];
}

export class CreateStatusDto {
  @ApiProperty() name: string;
}





export class PostEditDto {
  @ApiProperty() id: number;
  @ApiProperty() title: string;
  @ApiProperty() content: string;
  @ApiProperty() city: string;
  @ApiProperty() latitude: string;
  @ApiProperty() longitude: string;
  @ApiProperty() imageUrl: string;
  }

