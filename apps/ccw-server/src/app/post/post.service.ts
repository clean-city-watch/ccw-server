import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient,Prisma ,Post} from '@prisma/client';
import { CreateStatusDto, FilterPostsResponseDto, PostCreateDto, PostResponseDto } from './dto/post.dto';

@Injectable()
export class PostService {
    private prismaService = new PrismaClient()


    async getLatLangs(){

      const latlangs = await this.prismaService.post.findMany({
        select:{
          latitude: true,
          longitude: true
        },
        
      });

      const result = latlangs.map((value)=>{

        return [value.latitude,value.longitude];
      })
      return result; 
    }


    getpostbyid(id:number){
      return this.prismaService.post.findFirst({
        include: {
          _count: {
            select:{
              upvotes: true,
              comments: true
            }
          },
          status: {
            select:{
              name: true
            }
          },
          author: {
            select:{
              id: true,
              profile: true
            }
          }
        },
        where: {
          id: id
        }
      });


    }


    post(id: number): Promise<PostResponseDto | null> {
      return this.prismaService.post.findUnique({
        where: {
            id: id
        },
      });
    }


    postStatusForPost(createStatusDto:CreateStatusDto){
      return this.prismaService.status.create({
        data: createStatusDto
      })
    }

    getStatuses(){
      return this.prismaService.status.findMany();
    }

    
    allpost(){
      return this.prismaService.post.findMany({
        include: {
          _count: {
            select:{
              upvotes: true,
              comments: true
            }
          },
          status: {
            select:{
              name: true
            }
          },
          author: {
            select:{
              id: true,
              profile: true
            }
          }
        }
      });
    }
  
    async posts(params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.PostWhereUniqueInput;
      where?: Prisma.PostWhereInput;
      orderBy?: Prisma.PostOrderByWithRelationInput;
    }): Promise<PostResponseDto[]> {
      const { skip, take, cursor, where, orderBy } = params;
      return this.prismaService.post.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    }

    async getFilteredPosts(
      pageSize: number,
      pageOffset: number,
      city: string,
      title: string,
      content: string,
      userId: number,
      self: boolean,
      sortBy: string,
      sortOrder: 'asc' | 'desc'
    ): Promise<FilterPostsResponseDto> {
      const whereArray = [];
      let whereQuery = {};
  
      //TODO: just uncomment and you will get for and query in findmany
      if(self !== undefined){
        whereArray.push({ authorId :  userId  });
      }
      
      if (city !== undefined) {
        whereArray.push({ city:  city  });
      }
  
      if (title !== undefined) {
        whereArray.push({ title: { contains: title } });
      }

      if (content !== undefined) {
        whereArray.push({ content: { contains: content } });
      }
  
      if (whereArray.length > 0) {
        if (whereArray.length > 1) {
          whereQuery = { AND: whereArray };
        } else {
          whereQuery = whereArray[0];
        }
      }
      console.log(whereQuery);
  
      const sort = (sortBy ? sortBy : 'id').toString();
      const order = sortOrder ? sortOrder : 'asc';
      const size = pageSize ? pageSize : 10;
      const offset = pageOffset ? pageOffset : 0;
      const orderBy = { [sort]: order };
      const count = await this.prismaService.post.count({
        where: whereQuery,
      });
  
      const posts = await this.prismaService.post.findMany({
        include: {
          _count: {
            select:{
              upvotes: true,
              comments: true
            }
          },
          status: {
            select:{
              name: true
            }
          },
          author: {
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
          },
          upvotes:{
            where:{
              userId:userId
            },
            select: {
              id: true
            }
          }
        },
        where: whereQuery,
        take: Number(size),
        skip: Number(size * offset),
        orderBy,
      });
      return {
        size: size,
        number: offset,
        total: count,
        sort: [
          {
            by: sort,
            order: order,
          },
        ],
        content: posts,
      };
    }


    

    async getallpostsCountbyStatusPerUser(userid: number){
      const openposts = await  this.prismaService.user.findMany({
        select:{
          posts:{
            select:{
              id: true
            },
            where:{
              statusId: 1
            }
          }
        },
        where:{
          id: userid
        }
      });
      const returnCount = {};
      
      if(openposts.length!=0){
        returnCount['open'] = openposts[0].posts.length
      }else{
        returnCount['open'] = 0
      }
      const inprogressposts = await  this.prismaService.user.findMany({
        select:{
          posts:{
            select:{
              id: true
            },
            where:{
              statusId: 2
            }
          }
        },
        where:{
          id: userid
        }
      });
      if(inprogressposts.length!=0){
        returnCount['inprogress'] = inprogressposts[0].posts.length
      }else{
        returnCount['inprogress'] = 0
      }
      const inreviewposts = await  this.prismaService.user.findMany({
        select:{
          posts:{
            select:{
              id: true
            },
            where:{
              statusId: 3
            }
          }
        },
        where:{
          id: userid
        }
      });
      if(inreviewposts.length!=0){
        returnCount['inreview'] =inreviewposts[0].posts.length
      }else{
        returnCount['inreview'] = 0
      }
      const resolvedposts = await  this.prismaService.user.findMany({
        select:{
          posts:{
            select:{
              id: true
            },
            where:{
              statusId: 4
            }
          }
        },
        where:{
          id: userid
        }
      });
      if(resolvedposts.length!=0){
        returnCount['resolved'] =resolvedposts[0].posts.length
      }else{
        returnCount['resolved'] = 0
      }
      const reopenposts = await  this.prismaService.user.findMany({
        select:{
          posts:{
            select:{
              id: true
            },
            where:{
              statusId: 5
            }
          }
        },
        where:{
          id: userid
        }
      });
      if(reopenposts.length!=0){
        returnCount['reopen'] =reopenposts[0].posts.length
      }else{
        returnCount['reopen'] = 0
      }
      const onholdposts = await  this.prismaService.user.findMany({
        select:{
          posts:{
            select:{
              id: true
            },
            where:{
              statusId: 6
            }
          }
        },
        where:{
          id: userid
        }
      });
      if(onholdposts.length!=0){
        returnCount['onhold'] =onholdposts[0].posts.length
      }else{
        returnCount['onhold'] = 0
      }
      const invalidposts = await  this.prismaService.user.findMany({
        select:{
          posts:{
            select:{
              id: true
            },
            where:{
              statusId: 7
            }
          }
        },
        where:{
          id: userid
        }
      });
      if(invalidposts.length!=0){
        returnCount['invalid'] =invalidposts[0].posts.length
      }else{
        returnCount['invalid'] = 0
      }
      const blockedposts = await  this.prismaService.user.findMany({
        select:{
          posts:{
            select:{
              id: true
            },
            where:{
              statusId: 8
            }
          }
        },
        where:{
          id: userid
        }
      });
      if(blockedposts.length!=0){
        returnCount['blocked'] =blockedposts[0].posts.length
      }else{
        returnCount['blocked'] = 0
      }

      return returnCount;

    }

    async getPostCountbyStatus(){
     return  this.prismaService.status.findMany(
        {
          include:{
            _count: {
              select:{
                posts: true
              }
            }
          }
        }
      )
    }

    async getPostCount(){
      return this.prismaService.post.count();
    }
  
   async createPost(data: PostCreateDto): Promise<PostResponseDto> {

    // createPost(data: PostCreateDto,file): Promise<PostResponseDto> {
      
      //TODO : handle file upload to blob storage and get the imageurl for the post.
      // const imageurl = data.file.filename;
      const imageurl = 'test 1 file'
      // console.log(imageurl);
      console.log(data);

      const newPost = await this.prismaService.post.create({
        data:{
            title: data.title,
            content: data.content,
            imageUrl: imageurl,
            city: data.city,
            statusId: 1,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            published: Boolean(data.published),
            authorId: Number(data.authorId),
            type: data.type
        },
      });
      if(!newPost)  throw new HttpException("log is not updated",HttpStatus.INTERNAL_SERVER_ERROR);
        const updateLog = await this.prismaService.log.create({
          data:{
              userId:Number(data.authorId),
              message: `Request no ${newPost.id} Opened successfully!`
          }
      })
      if(!updateLog) throw new HttpException("log is not updated",HttpStatus.INTERNAL_SERVER_ERROR);

      return newPost;
    
    }


  
    async updatePost(params: {
      where: Prisma.PostWhereUniqueInput;
      data: Prisma.PostUpdateInput;
    }): Promise<PostResponseDto> {
      const { data, where } = params;
      return this.prismaService.post.update({
        data,
        where,
      });
    }
  
    async deletePost(where: Prisma.PostWhereUniqueInput): Promise<PostResponseDto> {
      return this.prismaService.post.delete({
        where,
      });
    }
  }