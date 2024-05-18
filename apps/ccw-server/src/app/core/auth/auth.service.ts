import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserResponse } from '../../user/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from '../../notification/notification.service';

@Injectable()
export class AuthService {
    constructor (private configService: ConfigService,private jwtService: JwtService, private readonly notificationService: NotificationService ){}
    private prismaService = new PrismaClient();


    hashPassword(password: string): Promise<string> {
        const saltRounds = Number(
          this.configService.get<number>('bcrypt.saltRounds')
        );
        return bcrypt.hash(password, saltRounds);
      }
    
    comparePasswords(
        plainPassword: string,
        hashedPassword: string  
        ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
    }
    
    async validateUserRequest(request: { headers: { [x: string]: string } }) {
        const id = request.headers['id'];
        const email = request.headers['email'];
        if (id == undefined || email == undefined) {
            return false;
        }
        const user = await this.prismaService.user.findFirst({
            where: {
                id: Number(id),
                email: email
            },
        });
        if (!user) {
            return false;
        }
        return true
        
    }





    async loginUser(userDto: CreateUserDto): Promise<LoginUserResponse> {

        // const userPassword = await this.authService.hashPassword(userDto.password);
        // console.log(userPassword);
        
        const user =  await this.prismaService.user.findFirst({
          where:{
            email: userDto.email
          },
          include: {
            superRoles:{
              include:{
                superRole: true,
              }
            },
            organizationRoles: {
              include: {
                organizationRole: true,
                organization:{
                  select:{
                    id: true,
                    name: true
                  }
                }
              },
            },
            communityRoles: {
              include: {
                communityRole: true,
                community:{
                  select:{
                    id: true,
                    name: true
                  }
                }
              },
            },
            profile:true
          },
        });

        
        if(!user) throw new HttpException("User not found",HttpStatus.NOT_FOUND);
        const usrpass = this.comparePasswords(userDto.password,user.password);
    
        if(!usrpass) throw new HttpException("Incorrect password",HttpStatus.NOT_FOUND);
       
    
        const payload = {
          sub: user.id,
          email: user.email,
          roles: {
            'super': [ ...user.superRoles.map((role)=>role.superRole.id)],
            'organization': [...user.organizationRoles.map((role) => role.organizationRole.id)],
            'community': [...user.communityRoles.map((role) => role.communityRole.id)],
          },
          timestamp: String(user.timestamp)
      };
      console.log(payload)
      // await this.notificationService.sendEmail('yash.p@hofintech.com','login test','login success!');
        return {
          id: String(user.id),
          access_token: await this.jwtService.signAsync(payload),
          avatar: user.profile.avatar,
          userLogin: (payload.roles.super.length>0) ? true: false,
          orgManagerLogin: (payload.roles.organization.length) ? true: false
        };
    
      }
    
    



    
}
