import { Test, TestingModule } from '@nestjs/testing';
import { BursaMalaysiaService } from '../../bursa-malaysia.service';
import { BasicHelperModule } from '@app/basic-helper';

describe('BursaMalaysiaService', () => {
  let service: BursaMalaysiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BursaMalaysiaService],
      imports: [BasicHelperModule]
    }).compile();

    service = module.get<BursaMalaysiaService>(BursaMalaysiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined()
  })


});



