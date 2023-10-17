import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUpvoteDto } from './dto/create-upvote.dto';


@Injectable()
export class UpvoteService {
  private prismaService = new PrismaClient()

  async create(createUpvoteDto: CreateUpvoteDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: Number(createUpvoteDto.userId)
      }
    })
    if(!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    const post = await this.prismaService.post.findUnique({
      where: {
        id: Number(createUpvoteDto.postId)
      }
    })
    if(!post) throw new HttpException('post not found', HttpStatus.NOT_FOUND);

    const existingUpvote = await this.prismaService.upvote.findFirst({
      where: {
        userId: Number(createUpvoteDto.userId),
        postId: Number(createUpvoteDto.postId)
      }
    })
    console.log(existingUpvote);
    console.log(createUpvoteDto.userId,createUpvoteDto.postId);
    if(existingUpvote) throw new HttpException('upvote already exist!', HttpStatus.NOT_FOUND);
    return this.prismaService.upvote.create({
      data: {
        userId: Number(createUpvoteDto.userId),
        postId: Number(createUpvoteDto.postId)
      }
    })
  }

  findAll() {
    return this.prismaService.upvote.findMany({});
  }

  findOne(id: number) {
    return this.prismaService.upvote.findUnique({
      where: {
        id: id
      }
    })
  }


  remove(id: number) {
    return this.prismaService.upvote.delete({
      where: {
        id: id
      }
    });
  }
}
