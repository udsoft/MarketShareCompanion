import { CompanyProfileExtractor } from "../company-profile.extractor"
import { TestingModule, Test } from "@nestjs/testing"
import { promises } from "fs"
import { join } from "path"
import { cwd } from "process"
import cheerio = require('cheerio');


describe('Company Profile Data Extraction', () => {

    let service: CompanyProfileExtractor



    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CompanyProfileExtractor],
            imports: []
        }).compile();

        service = module.get<CompanyProfileExtractor>(CompanyProfileExtractor);
    })


    describe('Test All should pass cases', () => {
        let passMockHtml: CheerioStatic;
        beforeEach(async () => {

            const goodFilePath = join(cwd(),
                'src', 'plugins', 'bursa-malaysia',
                'extract', 'company_profile',
                'spec', 'mock', 'company_profile.html')

            const cheerioStatic = async (filePath: string) => {
                const htmlPage = await promises.readFile(filePath);
                return cheerio.load(htmlPage);
            };


            passMockHtml = await cheerioStatic(goodFilePath)

        })

        it('should extract the company name', async () => {
            const companyName = service.getCompanyFullName(passMockHtml);
            expect(companyName).toBe('ANZO HOLDINGS BERHAD')
        });

        it('should extract the company market', async () => {

            const market = service.getMarket(passMockHtml);
            expect(market).toBe('Main Market')
        });

        it('should extract the company sector', async () => {
            const sector = service.getSector(passMockHtml);
            expect(sector).toBe('INDUSTRIAL PRODUCTS & SERVICES')
        })



    })

})