import { Injectable } from '@nestjs/common';

import { PrismaClient,Prisma } from '@prisma/client'

@Injectable()
export class LeadboardService {

    private prismaService = new PrismaClient()

    getLeadUsers(){
        return this.prismaService.user.findMany({
            select:{
                id : true,
                profile:{
                    select:{
                        firstName: true,
                        LastName: true,
                        
                    }
                }
            },
            orderBy: {
              coins: {
                coins: 'asc'
              },
            },
          });

    }
}
