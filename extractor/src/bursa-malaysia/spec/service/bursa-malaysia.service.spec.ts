import { Test, TestingModule } from '@nestjs/testing';
import { BursaMalaysiaService } from '../../bursa-malaysia.service';
import cheerio = require('cheerio');
import { promises } from 'fs';
import { cwd } from 'process';
import { join } from 'path';

describe('BursaMalaysiaService', () => {
  let service: BursaMalaysiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BursaMalaysiaService],
      imports: []
    }).compile();

    service = module.get<BursaMalaysiaService>(BursaMalaysiaService);
  });


  it('Get total max number page, so must be integer type', async () => {
    const filePath = join(cwd(), 'src', 'bursa-malaysia', 'spec', 'spec_data', 'equities_prices.html')
    const htmlPage = await promises.readFile(filePath);
    const $ = cheerio.load(htmlPage);
    const maxPage: number = await service.getTotalPage($);
    expect(maxPage).toBe(94);
  });

  it('Get correct next page url', () => {
    const nextPageURL = service.getEquityPriceUrlForGivenPageNumber(2).href;
    expect(nextPageURL)
      .toBe('https://www.bursamalaysia.com/market_information/equities_prices?page=2')
  })

  it('Get list of company code', async () => {
  const filePath = join(cwd(), 'src', 'bursa-malaysia', 'spec', 'spec_data', 'equities_prices.html')
    const htmlPage = await promises.readFile(filePath);
    const $ = cheerio.load(htmlPage);
    const listOfCompanyCode = await service.extractCompanyCodesInThePage($);
    const expectedCompanyCode = [
      "0188WA", "0111", "0163",
      "0182", "0188", "0187", "0150",
      "0036", "7164", "5216WA", "0024",
      "0111WC", "0165", "0082", "0100",
      "0133", "0133WE", "5243", "5216",
       "7013"];
    expect(listOfCompanyCode).toEqual(expectedCompanyCode);
  })


});
