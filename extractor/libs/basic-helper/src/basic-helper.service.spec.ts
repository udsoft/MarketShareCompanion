import { Test, TestingModule } from '@nestjs/testing';
import { BasicHelperService } from './basic-helper.service';

describe('BasicHelperService', () => {
  let service: BasicHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasicHelperService],
    }).compile();

    service = module.get<BasicHelperService>(BasicHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create array with fill from 1 to 10', () => {
    const expectedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = service.getFilledArrayWithIncrementalNumber(10);
    expect(result).toStrictEqual(expectedArray);
  });

});
