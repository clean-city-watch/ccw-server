import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaClient ,Prisma,User} from '@prisma/client'
import { AuthService } from '../core/auth/auth.service';
import { CreateMemberDto } from './dto/create-member.dto';
// import * as bcrypt from "bcrypt";
import { CreateUserDto, LoginUserResponse, UserResponseDto } from './dto/user.dto';
import { keycloakAdminClient } from '../keycloak/keycloak';
import { SuperRoleName } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private authService: AuthService){}


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

  async Keycloak_getUsers(){
    const client = await keycloakAdminClient();

    const allusers = await client.users.find()
    
    return allusers;
  }


  async signinUser_Keycloak(userDto:  CreateUserDto){
    if(userDto){
      const client = await keycloakAdminClient(userDto.email,userDto.password);
      return await client.getAccessToken();
    }
    throw new HttpException("email or password required", HttpStatus.BAD_REQUEST);
  }

  

  async signupUser_Keycloak(member: CreateMemberDto){
    const existCheck=await this.prismaService.user.findFirst({
      where: {
        email: member.email
      }
    });
    if(existCheck){
      return {
        success:false,
        status:404,
        msg: 'User already exists',
      }
    }

    try{
      // const saltOrRounds = 10;
      // member.password=await bcrypt.hash(password, saltOrRounds);

       const keycloakData={
         username: member.name,
         email: member.email,
         firstName: member.name,
         lastName: member.name,
         password: member.password,
       }
     const ssoUser= await this.keyCloakRegistration(keycloakData);
       console.log(ssoUser,'ssoUser Data',keycloakData);
       if (!ssoUser) {
         throw new BadRequestException('Registration failed');
       }
       return this.prismaService.user.create({
        data:{
          email: ssoUser.id,
          password: member.password
        }
       })
     
    }catch (error){
      console.log(error,"error");
        return {
          success:false,
          status:404,
          msg: "Phone no is already taken",
        }
      }

  }



  async keyCloakRegistration(keyCloakUserData) {
    const client = await keycloakAdminClient();

    const keycloakUserNameCount = await client.users.count({
      username: keyCloakUserData.username,
    });
    const keycloakUserEmailCount = await client.users.count({
      email: keyCloakUserData.email,
    });

    if (keycloakUserNameCount > 0 || keycloakUserEmailCount > 0) {
      return false;
    }

    return await client.users.create({
      username: keyCloakUserData.username,
      email: keyCloakUserData.email,
      firstName: keyCloakUserData.first_name,
      lastName: keyCloakUserData.last_name,
      enabled: true,
      credentials: [
        {
          type: 'password',
          value: keyCloakUserData.password,
          temporary: false,
        },
      ],
    });
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
}
