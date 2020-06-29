import { join } from "path";
import { promises } from "fs";
import { cwd } from "process";
import cheerio = require('cheerio');
import { HttpException } from "@nestjs/common";
import { EquityPageExtractor } from "../equity-page.extractor";
import { BasicHelperModule } from "@app/basic-helper";
import { TestingModule, Test } from "@nestjs/testing";
import { SharedExtractor } from "../../shared/shared.extractor";


describe('Equity Page Extractor', () => {
    let service: EquityPageExtractor;

    const goodFilePath = join(cwd(),
        'src', 'plugins', 'bursa-malaysia',
        'extract', 'equity_page',
        'spec', 'mock', 'equities_prices.html')

    const badPagePath = join(cwd(),
        'src', 'plugins', 'bursa-malaysia',
        'extract', 'equity_page', 'spec',
        'mock', 'equities_prices_fail.html')


    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [EquityPageExtractor,SharedExtractor],
            imports: [BasicHelperModule]
        }).compile()

        service = module.get<EquityPageExtractor>(EquityPageExtractor);

    });

    describe('Company code extraction testing', () => {

        it('Get correct next page url', () => {
            const nextPageURL = service.getEquityPriceUrlForGivenPageNumber(2).href;
            expect(nextPageURL)
                .toBe('https://www.bursamalaysia.com/market_information/equities_prices?page=2')
        })

        it('Should return all the company code in the page ', async () => {
            const htmlPage = await promises.readFile(goodFilePath);
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

                const htmlPage = await promises.readFile(goodFilePath);
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

                const htmlPage = await promises.readFile(badPagePath);
                $ = cheerio.load(htmlPage);
            })

            it('should fail as the header is changed in the html', () => {
                const failValidation = () => service.validateTableHeaderOfEquityPricePage($);
                expect(failValidation).toThrow(HttpException);
            })
        })

    })

})

