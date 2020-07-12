import { CompanyAnnouncementExtractor } from "../company-announcement.extractor";
import { TestingModule, Test } from "@nestjs/testing";
import { join } from "path";
import { promises } from "fs";
import { cwd } from "process";
import cheerio = require('cheerio');
import { CompanyAnnouncement } from "../entity/company-announcement";
import { SharedExtractor } from "../../shared/shared.extractor";
import { BasicHelperModule } from "@app/basic-helper";



describe('Extract Company Announcement', () => {
    
    let service: CompanyAnnouncementExtractor;

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CompanyAnnouncementExtractor, SharedExtractor],
            imports: [BasicHelperModule]
        }).compile();
        service = module.get<CompanyAnnouncementExtractor>(CompanyAnnouncementExtractor);
     });
    

    describe('All Pass Test Suite', () => {

        let passMockHtml: CheerioStatic;
        beforeEach(async () => {
            const goodFilePath = join(cwd(),
                'src', 'plugins', 'bursa-malaysia',
                'extract', 'company_announcements',
                'spec', 'mock', 'company_announcements.html')

            const cheerioStatic = async (filePath: string) => {
                const htmlPage = await promises.readFile(filePath);
                return cheerio.load(htmlPage,{normalizeWhitespace: true});
            };

            passMockHtml = await cheerioStatic(goodFilePath)

        })


        it('should have valid header',  () => {
            const isValid = service.tableValidation(passMockHtml);
            expect(isValid).toEqual(true);
        })


        it('should get all announcement from the page', async () => {
            const mockUpCompanyAnnouncement: CompanyAnnouncement =  {
                companyName: "ANZO HOLDINGS BERHAD",
                date: new Date('17 Jun 2020'),
                newsUrl: new URL("https://www.bursamalaysia.com/market_information/announcements/company_announcement/announcement_details?ann_id=3059578")
            }

            const companyAnnouncement = service.extractAnnouncement(passMockHtml);
            expect(companyAnnouncement[10]).toStrictEqual(mockUpCompanyAnnouncement);
        })

        it('should get latest company URL', () => {
            const expectedURL = new URL('https://www.bursamalaysia.com/market_information/announcements/company_announcement?company=udw&page=1&sort_by=annDt&sort_dir=desc')
            const latestAnnURL = service.latesCompanyAnnouncementURL('udw')
            expect(latestAnnURL).toStrictEqual(expectedURL);
        })


    })


    describe('All Fail Test Suite', () => {

        let failMockHtml: CheerioStatic;
        beforeEach(async () => {
            const failFilePath = join(cwd(),
                'src', 'plugins', 'bursa-malaysia',
                'extract', 'company_announcements',
                'spec', 'mock', 'fail_test.html')

            const cheerioStatic = async (filePath: string) => {
                const htmlPage = await promises.readFile(filePath);
                return cheerio.load(htmlPage,{normalizeWhitespace: true});
            };

            failMockHtml = await cheerioStatic(failFilePath)

        })

        it('should fail valid header check',  () => {
            const failTableValidation = () => { service.tableValidation(failMockHtml); }
            expect(failTableValidation).toThrow(Error);
        })


    })


})