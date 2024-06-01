import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';
import { FeedbackModule } from './feedback/feedback.module';
import { CommentModule } from './comment/comment.module';
import { UpvoteModule } from './upvote/upvote.module';
import { LogController } from './log/log.controller';
import { LogService } from './log/log.service';
import { GreenCoinController } from './green-coin/green-coin.controller';
import { LeadboardController } from './leadboard/leadboard.controller';
import { LeadboardService } from './leadboard/leadboard.service';
import { GreenCoinService } from './green-coin/green-coin.service';
import { OrganizationController } from './organization/organization.controller';
import { OrganizationService } from './organization/organization.service';
import { NotificationModule } from './notification/notification.module';
import { MinioService } from './minio/minio.service';
import { MinioModule } from './minio/minio.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PostModule,
    ProfileModule,
    FeedbackModule,
    CommentModule,
    UpvoteModule,
    NotificationModule,
    MinioModule,
  ],
  controllers: [
    AppController,
    LogController,
    GreenCoinController,
    LeadboardController,
    OrganizationController,
  ],
  providers: [
    AppService,
    LogService,
    MinioService,
    ConfigService,
    LeadboardService,
    GreenCoinService,
    OrganizationService,
  ],
})
export class AppModule {}
