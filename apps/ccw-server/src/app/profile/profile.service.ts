import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient ,Prisma} from '@prisma/client';
import { ProfilePicUploadDto, ProfileResponseDto } from './dto/profile.dto';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class ProfileService {
    constructor(private minioService: MinioService){}

    private prismaService = new PrismaClient()

    async editProfilePic(file:  Express.Multer.File, profilepicUploadDto: ProfilePicUploadDto){
        
        const profile = await this.prismaService.userProfile.findFirst({
            where:{
                userId: Number(profilepicUploadDto.id)
            }
        })

        if(!profile) throw new HttpException("User Profile not found!", HttpStatus.NOT_FOUND);

        if(profilepicUploadDto.fileName!=profile.avatar){

            if(!file) throw new HttpException("Pleae upload file", HttpStatus.BAD_REQUEST);

            if(profile.avatar!=null) {
                await this.minioService.deleteFile(profile.avatar);
            }

            const avatarUrl = await this.minioService.uploadFile(file);
            const updatedProfile  = await this.prismaService.userProfile.update({
                data:{
                    avatar: avatarUrl
                },
                where:{
                    id: Number(profilepicUploadDto.id)
                }
            })
            const updateLog = await this.prismaService.log.create({
                data:{
                    userId:Number(profilepicUploadDto.id),
                    message: "Profile updated successfully!"
                }
            })
            if(!updateLog) throw new HttpException("log is not updated",HttpStatus.INTERNAL_SERVER_ERROR);
            return updatedProfile
        }

    }
    

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
                message: "Profile updated successfully!"
            }
        })
        if(!updateLog) throw new HttpException("log is not updated",HttpStatus.INTERNAL_SERVER_ERROR);
        

        return updatedProfile;
    }
}
