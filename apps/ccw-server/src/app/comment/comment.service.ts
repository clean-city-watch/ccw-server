import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Http2ServerRequest } from 'http2';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  private prismaService = new PrismaClient();

  create(createCommentDto: CreateCommentDto, userId: number) {
    console.log(createCommentDto);
    const user = this.prismaService.user.findUnique({where:{
      id: userId
    }})
    if(!user) throw new  HttpException('user not found',HttpStatus.NOT_FOUND);

    const post = this.prismaService.post.findUnique({
      where: {
        id: createCommentDto.postId
      }
    })
    if(! post)  throw new  HttpException('post not found',HttpStatus.NOT_FOUND);

    return this.prismaService.comment.create({
      data : {
        postId: Number(createCommentDto.postId),
        content: createCommentDto.content,
        userId: userId
      }
    })
  }

  findAll() {
    return this.prismaService.comment.findMany({

    })
  }

  findOne(id: number) {
    return this.prismaService.comment.findUnique({
      where: {
        id: id
      }
    })
  }

  allCommentsforPost(id: number){
    return this.prismaService.post.findFirst({
      where: {
        id: id
      },
      select: {
        id: true,
        comments: {
          select:{
            content: true,
            createdAt: true,
            user:{
              select:{
                id: true,
                profile: {
                  select: {
                    firstName: true,
                    LastName: true,
                    avatar: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.prismaService.comment.update({
      where: {id: id},
      data: updateCommentDto
    });
  }

  remove(id: number) {
    return this.prismaService.comment.delete({
      where:{
        id: id
      }
    })
  }
}
