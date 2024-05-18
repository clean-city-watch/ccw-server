import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaClient ,Prisma,User} from '@prisma/client'
import { AuthService } from '../core/auth/auth.service';
import { CreateMemberDto } from './dto/create-member.dto';
// import * as bcrypt from "bcrypt";
import { CreateUserDto, ForgotPasswordDto, LoginUserResponse, UpdatePasswordDto, UserResponseDto } from './dto/user.dto';
import { SuperRoleName } from '@prisma/client';
import * as ejs from 'ejs';
import * as fs from 'fs/promises';

import { NotificationService } from '../notification/notification.service';
import { time } from 'console';

@Injectable()
export class UserService {
    constructor(private authService: AuthService,private notificationService: NotificationService){}


    private prismaService = new PrismaClient()
  
    async user(
        id:number,
      ): Promise<UserResponseDto | null> {
        const user = this.prismaService.user.findUnique({
            where: {
              id: id
            },
            select:{
                id: true,
                email: true,
                timestamp: true
            }
          });
        if(!user) throw new HttpException("User not found",HttpStatus.NOT_FOUND);
        return user
      }

   users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<UserResponseDto[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        email: true,
        timestamp: true
    },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {

    const existingUser = await this.prismaService.user.findFirst({
      where:{
        email: createUserDto.email
      }
    })
    if(existingUser) throw new HttpException("user already exist please signin",HttpStatus.BAD_REQUEST)


    const userPassword = await this.authService.hashPassword(createUserDto.password);
    
    
    const user =  await this.prismaService.user.create({
      data:{
        email: createUserDto.email,
        password: userPassword,

      },
    });
    if(!user) throw new HttpException("User creation error",HttpStatus.BAD_REQUEST);
    const profile = await this.prismaService.userProfile.create({
      data: {
        userId: Number(user.id)
      }
    })

    const green_coin = await this.prismaService.greenCoin.create({
      data:{
        userId: Number(user.id),
        coins: 0
      }
    })

    const userRole = await this.prismaService.superRole.findFirst({
      where:{
        name: SuperRoleName.ADMIN
      }
    })

    const userSuper = await this.prismaService.userSuperRole.create({
      data:{
        userId: Number(user.id),
        superRoleId: userRole.id
      }
    })

    return {
        id: user.id,
        email: user.email,
        timestamp: user.timestamp
    }
  }
  
  
  async getAllCount(userid: number){

    // Open, In Progress, Review, Resolved, Reopened, On Hold,Invalid,Blocked

    const allCountbyId = await this.prismaService.user.findMany({
        select: {
          coins: true,
          timestamp: true,
          _count:{
            select:{
              posts: true,
              comments: true,
              upvotes: true,
              feedbacks: true
            },
            
          }
        },
        where: {
          id: userid
        }
    });
    return allCountbyId[0];

}


async getCount(){
  
  const allCount = await this.prismaService.user.count();
  return allCount;

}



  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prismaService.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.delete({
      where,
    });
  }
  
  
  generateRandomHexToken(length: number): string {
    const characters = '0123456789abcdef';
    let token = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }
    return token;
  }

  generateRandomOTP(length: number): string {
    const characters = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters.charAt(randomIndex);
    }
    return otp;
  }

  


  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: forgotPasswordDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.generateRandomHexToken(16);
    const otp = this.generateRandomOTP(6);
    const updateUserToken = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: token,
        otp: otp
        
      },
      select:{
        profile: true,
        email: true,
        timestamp: true
      }
    });


    const templateContent = await fs.readFile(
      'apps/api/src/assets/templates/forgot-password-template.ejs',
      'utf-8'
    );
    const message = ejs.render(templateContent, {
      firstName: updateUserToken.profile.firstName,
      lastName: updateUserToken.profile.LastName,
      otp: otp,
    });

    const sentMail = await this.notificationService.sendEmail(
      forgotPasswordDto.email,
      'Forgot Password',
      message
    );

    if (!sentMail)
      throw new HttpException(
        'there is some problem while sending mail',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    return {
      email: updateUserToken.email,
      token: token,
    };
  }


  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: updatePasswordDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.token != updatePasswordDto.token) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid token',
        },
        HttpStatus.BAD_REQUEST
      );
    }
    
    if (user.otp != updatePasswordDto.otp) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid otp',
        },
        HttpStatus.BAD_REQUEST
      );
    }
    

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await this.authService.hashPassword(updatePasswordDto.password),
        token: null,
        otp: null
      },
      select:{
        profile: true,
        email: true,
        id: true
      }
    });

    const templateContent = await fs.readFile(
      'apps/api/src/assets/templates/update-password-template.ejs',
      'utf-8'
    );
    const message = ejs.render(templateContent, {
      firstName: updatedUser.profile.firstName,
      lastName: updatedUser.profile.LastName,
    });

    const sentMail = await this.notificationService.sendEmail(
      updatedUser.email,
      'Update Password',
      message
    );

    if (!sentMail)
      throw new HttpException(
        'there is some problem while sending mail',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      phoneNumber: updatedUser.profile.phoneNumber,
      firstName: updatedUser.profile.firstName,
      lastName: updatedUser.profile.LastName,
    };
  }

}
