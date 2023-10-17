import { Test, TestingModule } from '@nestjs/testing';
import { GreenCoinController } from './green-coin.controller';

describe('GreenCoinController', () => {
  let controller: GreenCoinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GreenCoinController],
    }).compile();

    controller = module.get<GreenCoinController>(GreenCoinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
