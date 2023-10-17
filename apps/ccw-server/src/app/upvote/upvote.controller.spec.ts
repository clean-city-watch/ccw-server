import { Test, TestingModule } from '@nestjs/testing';
import { UpvoteController } from './upvote.controller';
import { UpvoteService } from './upvote.service';

describe('UpvoteController', () => {
  let controller: UpvoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpvoteController],
      providers: [UpvoteService],
    }).compile();

    controller = module.get<UpvoteController>(UpvoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
