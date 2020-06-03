import { Test, TestingModule } from '@nestjs/testing';
import { BursaMalaysiaController } from '../bursa-malaysia.controller';

describe('BursaMalaysia Controller', () => {
  let controller: BursaMalaysiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BursaMalaysiaController],
    }).compile();

    controller = module.get<BursaMalaysiaController>(BursaMalaysiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
