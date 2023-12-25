import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../core/auth/auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from '../core/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { AuthModule } from '../core/auth/auth.module';
import { NotificationModule } from '../notification/notification.module';
import { NotificationService } from '../notification/notification.service';

@Module({imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService,AuthService,ConfigService,NotificationService],
})
export class UserModule {}
