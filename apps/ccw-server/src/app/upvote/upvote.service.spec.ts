import { Test, TestingModule } from '@nestjs/testing';
import { UpvoteService } from './upvote.service';

describe('UpvoteService', () => {
  let service: UpvoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpvoteService],
    }).compile();

    service = module.get<UpvoteService>(UpvoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
