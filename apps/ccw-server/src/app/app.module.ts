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

@Module({
  imports: [
    UserModule,
    AuthModule,
    PostModule,
    ProfileModule,
    FeedbackModule,
    CommentModule,
    UpvoteModule,
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
    LeadboardService,
    GreenCoinService,
    OrganizationService,
  ],
})
export class AppModule {}
