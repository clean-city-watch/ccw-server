import { Test, TestingModule } from '@nestjs/testing';
import { LeadboardController } from './leadboard.controller';

describe('LeadboardController', () => {
  let controller: LeadboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadboardController],
    }).compile();

    controller = module.get<LeadboardController>(LeadboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
