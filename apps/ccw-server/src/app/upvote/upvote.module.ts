import { Module } from '@nestjs/common';
import { UpvoteService } from './upvote.service';
import { UpvoteController } from './upvote.controller';

@Module({
  controllers: [UpvoteController],
  providers: [UpvoteService],
})
export class UpvoteModule {}
