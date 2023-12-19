import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';
import { ROLES_KEY } from './roles.decorator';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private prisma = new PrismaClient();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
   
    if (!requiredRoles) {
      return true;
    }

    console.log('required role: ',requiredRoles)

    const { user } = context.switchToHttp().getRequest();

    console.log('user inside roles guard',user)

    

    console.log(user.roles)

    console.log(" user.sub: ",user.sub)
    
    let condition = false;

    for (const role of requiredRoles) {
      switch (role) {
        case Role.ADMIN:
          console.log('admin role got ...........')
          condition = condition || await this.checkSuperRoles(user.sub,user.roles['super']);
          console.log('after the admin check super role',condition)
          break;

        case Role.MODERATOR:
          console.log('mod role got ...........')
          condition = condition || await this.checkSuperRoles(user.sub,user.roles['super']);
          break;

        case Role.VIEWER:
          console.log('view role got ...........')
          condition = condition || await this.checkSuperRoles(user.sub,user.roles['super']);
          break;

        case Role.ORGANIZATION_ADMIN:
          console.log('oa role got ...........')
          condition = condition || await this.checkOrganizationRoles(user.sub,user.roles['organization']);
          break;
        case Role.ORGANIZATION_MODERATOR:
          console.log('om role got ...........')
          condition = condition || await this.checkOrganizationRoles(user.sub,user.roles['organization']);
          break;
        case Role.ORGANIZATION_VIEWER:
          console.log('ov role got ...........')
          condition = condition || await this.checkOrganizationRoles(user.sub,user.roles['organization']);
          break;
        case Role.COMMUNITY_ADMIN:
          console.log('ca role got ...........')
          condition = condition || await this.checkCommunityRoles(user.sub,user.roles['community']);
          break;
        case Role.COMMUNITY_MODERATOR:
          console.log('cm role got ...........')
          condition = condition || await this.checkCommunityRoles(user.sub,user.roles['community']);
          break;

        case Role.COMMUNITY_VIEWER:
          console.log('cv role got ...........')
          condition = condition || await this.checkCommunityRoles(user.sub,user.roles['community']);
          break;
        
      
        default:
          throw new UnauthorizedException();
      }
    }
    
    console.log('got condition ', condition);
    return condition;
  }

  private async checkSuperRoles(userId: number, rolesIdList: number[]): Promise<boolean> {
    const countedResult = await this.prisma.userSuperRole.count({
      where: { userId: userId, superRoleId: { in: rolesIdList } },
    });
    return countedResult > 0;
  }

  private async checkOrganizationRoles(userId: number, rolesIdList: number[]): Promise<boolean> {
    const countedResult = await this.prisma.userOrganizationRole.count({
      where: { userId: userId, organizationRoleId: { in: rolesIdList } },
    });
    return countedResult > 0;
  }

  private async checkCommunityRoles(userId: number, rolesIdList: number[]): Promise<boolean> {
    const countedResult = await this.prisma.userCommunityRole.count({
      where: { userId: userId, communityRoleId: { in: rolesIdList } },
    });
    return countedResult > 0;
  }

  
}

