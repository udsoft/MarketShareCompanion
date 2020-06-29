import { Test, TestingModule } from '@nestjs/testing';
import { BursaMalaysiaService } from '../../bursa-malaysia.service';
import { BasicHelperModule } from '@app/basic-helper';
import { EquityPageExtractor } from '../../extract/equity_page/equity-page.extractor';
import { SharedExtractor } from '../../extract/shared/shared.extractor';

describe('BursaMalaysiaService', () => {
  let service: BursaMalaysiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BursaMalaysiaService,EquityPageExtractor,SharedExtractor],
      imports: [BasicHelperModule]
    }).compile();

    service = module.get<BursaMalaysiaService>(BursaMalaysiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined()
  })


});



