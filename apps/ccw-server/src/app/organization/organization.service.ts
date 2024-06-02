import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AddIssueDto, CreateOrganizationDto, PatchIssueDto, UserOrgRelationDto } from './dto/organization.dto';
import { UserResponseDto } from '../user/dto/user.dto';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly minioService: MinioService) { }

  private prismaService = new PrismaClient()

  async createUsersRelationForOrganization(organizationId: number, userOrgRelationDto: UserOrgRelationDto) {
    const organization = await this.prismaService.organization.findFirst({
      where: {
        id: organizationId
      }
    })
    if (!organization) throw new HttpException("Organization not found", HttpStatus.NOT_FOUND);

    const user = await this.prismaService.user.findFirst({
      where: {
        email: userOrgRelationDto.userEmail
      }
    })
    if (!user) throw new HttpException("user not found", HttpStatus.NOT_FOUND);

    const role = await this.prismaService.organizationRole.findFirst({
      where: {
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


  async getPermissionforUser(organizationId: number, userId: number) {
    const permission = await this.prismaService.userOrganizationRole.findFirst(
      {
        where: {
          userId: userId,
          organizationId: organizationId,
          organizationRoleId: 1
        }
      }
    )

    if (permission) {
      return true;
    }
    return false;

  }

  async getissuesForOrganization(organizationId: number) {
    const issuesCountForOrganization = await this.prismaService.post.count({
      where: {
        type: "ISSUE",
        organizationId: organizationId,
      },
    });
    console.log(issuesCountForOrganization)
    return issuesCountForOrganization;
  }

  async addIssueForOrganization(organizationId: number, addIssueDto: AddIssueDto) {

    const isIssueExist = await this.prismaService.post.findFirst({
      where: {
        id: Number(addIssueDto.issueNumber)
      }
    })


    if (!isIssueExist) throw new HttpException("Issue doesn't exit", HttpStatus.BAD_REQUEST);

    if(isIssueExist.organizationId!=null){
      throw new HttpException("Issue is already assigned", HttpStatus.BAD_REQUEST);
    }

    const udpateIssue = await this.prismaService.post.update({
      where: {
        id: isIssueExist.id
      },
      data: {
        organizationId: Number(organizationId)
      }
    })

    return true;
  }

  async patchIssuesForOrganization(organizationId: number, patchIssueDto: PatchIssueDto) {

    const isIssueExist = await this.prismaService.post.findFirst({
      where: {
        organizationId: organizationId,
        id: Number(patchIssueDto.issueNumber)
      }
    })

    if (!isIssueExist) throw new HttpException("Issue doesn't exit", HttpStatus.BAD_REQUEST);

    const getStatus = await this.prismaService.status.findFirst({
      where: {
        name: patchIssueDto.status
      }
    })

    if (!getStatus) throw new HttpException("Status doesn't exit", HttpStatus.BAD_REQUEST);

    const udpateIssue = await this.prismaService.post.update({
      where: {
        id: isIssueExist.id
      },
      data: {
        statusId: getStatus.id
      }
    })

    return true;

  }

  getOrganizations(myOrganization: string, userId: number) {
    if (myOrganization == 'true') {
      return this.prismaService.organization.findMany({
        where: {
          users: {
            some: {
              id: userId
            }
          }
        }
      })
    }

    return this.prismaService.organization.findMany({

    })
  }


  async create(createOrganizationDto: CreateOrganizationDto, file: Express.Multer.File) {
    await this.minioService.createBucketIfNotExists();
    const imageurl = await this.minioService.uploadFile(file);

    return this.prismaService.organization.create({
      data: {
        name: createOrganizationDto.name,
        email: createOrganizationDto.email,
        type: createOrganizationDto.type,
        phoneNumber: createOrganizationDto.phoneNumber,
        addressLine1: createOrganizationDto.addressLine1,
        addressLine2: createOrganizationDto.addressLine2,
        city: createOrganizationDto.city,
        postalCode: createOrganizationDto.postalCode,
        countryCode: createOrganizationDto.countryCode,
        stateCode: createOrganizationDto.stateCode,
        logo: imageurl
      },
    });
  }


  async getProfile(id: number, userId: number) {
    const openposts = await this.prismaService.user.findMany({
      select: {
        posts: {
          select: {
            id: true
          },
          where: {
            statusId: 1,
            organizationId: id
          }
        }
      },
      where: {
        id: userId
      }
    });
    const returnCount = {};

    if (openposts.length != 0) {
      returnCount['open'] = openposts[0].posts.length
    } else {
      returnCount['open'] = 0
    }
    const inprogressposts = await this.prismaService.user.findMany({
      select: {
        posts: {
          select: {
            id: true
          },
          where: {
            statusId: 2,
            organizationId: id
          }
        }
      },
      where: {
        id: userId
      }
    });
    if (inprogressposts.length != 0) {
      returnCount['inprogress'] = inprogressposts[0].posts.length
    } else {
      returnCount['inprogress'] = 0
    }
    const inreviewposts = await this.prismaService.user.findMany({
      select: {
        posts: {
          select: {
            id: true
          },
          where: {
            statusId: 3,
            organizationId: id
          }
        }
      },
      where: {
        id: userId
      }
    });
    if (inreviewposts.length != 0) {
      returnCount['inreview'] = inreviewposts[0].posts.length
    } else {
      returnCount['inreview'] = 0
    }
    const resolvedposts = await this.prismaService.user.findMany({
      select: {
        posts: {
          select: {
            id: true
          },
          where: {
            statusId: 4,
            organizationId: id
          }
        }
      },
      where: {
        id: userId
      }
    });
    if (resolvedposts.length != 0) {
      returnCount['resolved'] = resolvedposts[0].posts.length
    } else {
      returnCount['resolved'] = 0
    }
    const reopenposts = await this.prismaService.user.findMany({
      select: {
        posts: {
          select: {
            id: true
          },
          where: {
            statusId: 5,
            organizationId: id
          }
        }
      },
      where: {
        id: userId
      }
    });
    if (reopenposts.length != 0) {
      returnCount['reopen'] = reopenposts[0].posts.length
    } else {
      returnCount['reopen'] = 0
    }
    const onholdposts = await this.prismaService.user.findMany({
      select: {
        posts: {
          select: {
            id: true
          },
          where: {
            statusId: 6,
            organizationId: id
          }
        }
      },
      where: {
        id: userId
      }
    });
    if (onholdposts.length != 0) {
      returnCount['onhold'] = onholdposts[0].posts.length
    } else {
      returnCount['onhold'] = 0
    }
    const invalidposts = await this.prismaService.user.findMany({
      select: {
        posts: {
          select: {
            id: true
          },
          where: {
            statusId: 7,
            organizationId: id
          }
        }
      },
      where: {
        id: userId
      }
    });
    if (invalidposts.length != 0) {
      returnCount['invalid'] = invalidposts[0].posts.length
    } else {
      returnCount['invalid'] = 0
    }
    const blockedposts = await this.prismaService.user.findMany({
      select: {
        posts: {
          select: {
            id: true
          },
          where: {
            statusId: 8,
            organizationId: id
          }
        }
      },
      where: {
        id: userId
      }
    });
    if (blockedposts.length != 0) {
      returnCount['blocked'] = blockedposts[0].posts.length
    } else {
      returnCount['blocked'] = 0
    }


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
    const data = { isOrganizationUser: isUserInOrganization ? true : false, ...returnCount, ...organization }
    console.log(data);
    return data
  }
}
