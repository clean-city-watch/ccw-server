import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient ,Prisma} from '@prisma/client';
import { ProfileResponseDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
    private prismaService = new PrismaClient()
    

    async getProfile(id:number) : Promise<ProfileResponseDto>{
        const profile = await this.prismaService.userProfile.findFirst({
            where:{
                userId: id
            }
        })

        if(!profile) throw new HttpException('profile not found',HttpStatus.NOT_FOUND);
        return profile
        
    }

    async editProfile(data:ProfileResponseDto): Promise<ProfileResponseDto>{
       const updatedProfile = await this.prismaService.userProfile.update({
            where:{
                userId:  Number(data.userId)
            },
            data:{
                firstName: data.firstName,
                LastName: data.LastName,
                phoneNumber: data.phoneNumber,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                avatar: data.avatar,
            }
        })
        if(!updatedProfile) throw new HttpException("profile is not updated",HttpStatus.INTERNAL_SERVER_ERROR);
        const updateLog = await this.prismaService.log.create({
            data:{
                userId:Number(data.userId),
                message: "profile updated successfully!"
            }
        })
        if(!updateLog) throw new HttpException("log is not updated",HttpStatus.INTERNAL_SERVER_ERROR);
        

        return updatedProfile;
    }
}
