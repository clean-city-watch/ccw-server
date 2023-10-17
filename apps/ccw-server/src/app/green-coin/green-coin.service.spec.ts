import { Test, TestingModule } from '@nestjs/testing';
import { GreenCoinService } from './green-coin.service';

describe('GreenCoinService', () => {
  let service: GreenCoinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GreenCoinService],
    }).compile();

    service = module.get<GreenCoinService>(GreenCoinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
