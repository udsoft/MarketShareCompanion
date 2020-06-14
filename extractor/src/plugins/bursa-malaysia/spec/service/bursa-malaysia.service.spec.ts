import { Test, TestingModule } from '@nestjs/testing';
import { BursaMalaysiaService } from '../../bursa-malaysia.service';
import cheerio = require('cheerio');
import { promises } from 'fs';
import { cwd } from 'process';
import { join } from 'path';
import { HttpException } from '@nestjs/common';
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

  describe('Company code extraction testing', () => {


    it('Get total max number page, so must be integer type', async () => {
      const filePath = join(cwd(), 'src','plugins', 'bursa-malaysia', 'spec', 'spec_data', 'equities_prices.html')
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

    it('Should return all the company code in the page ', async () => {
      const filePath = join(cwd(), 'src','plugins', 'bursa-malaysia', 'spec', 'spec_data', 'equities_prices.html')
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

  })


  describe('Page Validation', () => {
    
    describe('Page is still valid test', () => {
      let $: CheerioStatic;
      beforeAll(async () => {
        const filePath = join(cwd(), 'src','plugins', 'bursa-malaysia', 'spec', 'spec_data', 'equities_prices.html')
        const htmlPage = await promises.readFile(filePath);
        $ = cheerio.load(htmlPage);
      })
  
      it('Page is valid', () => {
        const isValid = service.validateTableHeaderOfEquityPricePage($)
        expect(isValid).toBe(true);
      })

    })


    describe('Page is not valid', () => {
      let $: CheerioStatic;
      beforeAll(async () => {
        const filePath = join(cwd(), 'src','plugins', 'bursa-malaysia', 'spec', 'spec_data', 'equities_prices_fail.html')
        const htmlPage = await promises.readFile(filePath);
        $ = cheerio.load(htmlPage);
      })

      it('should fail as the header is changed in the html', () => {
        const failValidation = () => service.validateTableHeaderOfEquityPricePage($);
        expect(failValidation).toThrow(HttpException);
      })
    })
  
  })

});



