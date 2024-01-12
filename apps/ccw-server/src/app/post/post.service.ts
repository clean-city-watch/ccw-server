import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient,Prisma ,Post} from '@prisma/client';
import { CreateStatusDto, FilterPostsResponseDto, PostCreateDto, PostEditDto, PostResponseDto } from './dto/post.dto';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class PostService {
    constructor(private readonly minioService: MinioService){}

    private prismaService = new PrismaClient()
    async updateImage(id: number, postData: PostEditDto,file: Express.Multer.File){
      console.log(postData);
      await this.minioService.createBucketIfNotExists()
      const post = await this.prismaService.post.findFirst({
        where:{
          id: id
        }
      })
      if(!post) throw new HttpException("post not found", HttpStatus.NOT_FOUND);

      if(post.imageUrl!='null'){
        await this.minioService.deleteFile(post.imageUrl);
      }

      const fileName = await this.minioService.uploadFile(file);
      console.log('filename for uploaded file is ', fileName);

      const updatedPost = await this.prismaService.post.update({
        where:{
          id: id
        },
        data:{
          imageUrl: fileName
        }
      })

      return updatedPost.imageUrl;
    }


    async getLatLangs(city: string){
      

      const allPostforCity = await this.prismaService.post.count({
        where:{
          city: city !==undefined ? city: "Pune"
        }
      })

      
      const allResolvedcountforCity = await this.prismaService.post.count({
        where:{
          city: city !==undefined ? city: "Pune",
          status:{
            name: 'Resolved'
          }
        }
      })

      const allinProgresscountforCity = await this.prismaService.post.count({
        where:{
          city:city !==undefined ? city: "Pune",
          status:{
            id: 2
          }
        }
      })

      const allOpencountforCity = await this.prismaService.post.count({
        where:{
          city:city !==undefined ? city: "Pune",
          status:{
            id: 1
          }
        }
      })

      const latlangs = await this.prismaService.post.findMany({
        where:{
          city:city !==undefined ? city: "Pune"
        },
        select:{
          latitude: true,
          longitude: true
        },
        
      });

      const result = latlangs.map((value)=>{

        return [value.latitude,value.longitude];
      })
      return {
        'content': result,
        'all': allPostforCity,
        'open': allOpencountforCity,
        'inprogress': allinProgresscountforCity,
        'resolved': allResolvedcountforCity
      }; 
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
          },
          polls: true,
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
  
   async createPost(data: PostCreateDto,file: Express.Multer.File): Promise<PostResponseDto> {

      if(data.type=='QUESTION'){
        console.log('question modal called');
        const newPost = await this.prismaService.post.create({
          data:{
              title: data.title,
              content: data.content,
              city: data.city,
              published: Boolean(data.published),
              authorId: Number(data.authorId),
              type: data.type,
              question: data.question
          },
        });

        if(!newPost)  throw new HttpException("log is not updated",HttpStatus.INTERNAL_SERVER_ERROR);
        const updateLog = await this.prismaService.log.create({
          data:{
              userId:Number(data.authorId),
              message: `Question is Posted on app!`
          }
        })
        if(!updateLog) throw new HttpException("log is not updated",HttpStatus.INTERNAL_SERVER_ERROR);

        return newPost;

      }
      else if(data.type=='ISSUE'){
        //TODO : handle file upload to blob storage and get the imageurl for the post.
        // const imageurl = data.file.filename;
        await this.minioService.createBucketIfNotExists();
        const imageurl = await this.minioService.uploadFile(file);
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
                message: `Request no ${newPost.id} Opened!`
            }
        })
        if(!updateLog) throw new HttpException("log is not updated",HttpStatus.INTERNAL_SERVER_ERROR);

        return newPost;

      }else if(data.type=='POLL'){
         const newPost = await this.prismaService.post.create({
          data:{
              title: data.title,
              content: data.content,
              city: data.city,
              published: Boolean(data.published),
              authorId: Number(data.authorId),
              type: data.type
          },
        });
        const pollPosts = await this.prismaService.poll.create({
          data:{
            postId: newPost.id,
            pollOptions: data.pollOptions
          }
        })
        if(!newPost)  throw new HttpException("log is not updated",HttpStatus.INTERNAL_SERVER_ERROR);
        const updateLog = await this.prismaService.log.create({
          data:{
              userId:Number(data.authorId),
              message: `Poll is posted on app!`
          }
        })
        if(!updateLog) throw new HttpException("log is not updated",HttpStatus.INTERNAL_SERVER_ERROR);

        return newPost;
      }

    }

    async editPost(postData: PostEditDto,file: Express.Multer.File){
      console.log(postData);
      await this.minioService.createBucketIfNotExists()
      const post = await this.prismaService.post.findFirst({
        where:{
          id: Number(postData.id)
        }
      })
      if(!post) throw new HttpException("post not found", HttpStatus.NOT_FOUND);

      let  fileName = post.imageUrl;
      if(post.imageUrl!=postData.imageUrl){
        console.log('inside the delete image method ')
        await this.minioService.deleteFile(post.imageUrl);
        fileName = await this.minioService.uploadFile(file);
      }
      
      console.log('filename for uploaded file is ', fileName);

      const {id , ...data} = postData;

      const editedPost = await this.prismaService.post.update({
        where:{
          id: Number((id))
        },
        data:{
          title: data.title,
          content: data.content,
          city: data.city,
          imageUrl: fileName,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
        }
      })

        
        return editedPost;
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