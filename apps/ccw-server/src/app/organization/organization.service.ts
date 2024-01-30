import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOrganizationDto, UserOrgRelationDto } from './dto/organization.dto';
import { UserResponseDto } from '../user/dto/user.dto';

@Injectable()
export class OrganizationService {
  private prismaService = new PrismaClient()

  async createUsersRelationForOrganization(organizationId: number, userOrgRelationDto: UserOrgRelationDto) {
    const organization = await this.prismaService.organization.findFirst({
      where:{
        id: organizationId
      }
    })
    if(!organization) throw new HttpException("Organization not found", HttpStatus.NOT_FOUND);

    const user = await this.prismaService.user.findFirst({
      where: {
        email: userOrgRelationDto.userEmail
      }
    })
    if(!user) throw new HttpException("user not found", HttpStatus.NOT_FOUND);

    const role = await this.prismaService.organizationRole.findFirst({
      where:{
        name: userOrgRelationDto.role
      }
    })

    const relation = await this.prismaService.userOrganizationRole.findFirst({
      where: {
        user: {
          email: userOrgRelationDto.userEmail
        },
        organizationId: organizationId
      }
    })
    if (relation) throw new HttpException("relation already exist", HttpStatus.BAD_REQUEST);

    const newRelation = await this.prismaService.userOrganizationRole.create({
      data: {
        userId: user.id,
        organizationRoleId: role.id,
        organizationId: organizationId

      }
    })



  }

  async getUsersForOrganization(organizationId: number, inroledUser: string): Promise<UserResponseDto[]> {

    if (inroledUser == "false") {
      const usersWithoutOrganization = await this.prismaService.user.findMany({
        select: {
          id: true,
          email: true,
          timestamp: true
        },
        where: {
          organizationRoles: {
            none: {}
          },
        },
      });
      return usersWithoutOrganization;
    }

    const usersWithOrganization = await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        timestamp: true
      },
      where: {
        organizationRoles: {
          some: {
            organizationId: organizationId, // Filter users with a relation to an organization

          },
        },
      },
    });
    return usersWithOrganization;

  }


  getOrganizations(myOrganization: string,userId: number) {
    if(myOrganization=='true'){
      return this.prismaService.organization.findMany({
        where:{
          users:{
            some:{
              id: userId
            }
          }
        }
      })
    }

    return this.prismaService.organization.findMany({

    })
  }


  async create(createOrganizationDto: CreateOrganizationDto) {
    return this.prismaService.organization.create({
      data: createOrganizationDto,
    });
  }


  async getProfile(id: number, userId: number) {
    const isUserInOrganization = await this.prismaService.userOrganizationRole.findFirst({
      where: {
        userId: userId,
        organizationId: id
      }
    })
    console.log(isUserInOrganization)

    const organization = await this.prismaService.organization.findFirst({
      where: {
        id: id
      },
      include: {
        users: {
          select: {
            user: {
              select: {
                id: true,
                email: false,
                password: false,
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
    });
    const data = { isOrganizationUser: isUserInOrganization ? true : false, ...organization }
    console.log(data);
    return data
  }
}
