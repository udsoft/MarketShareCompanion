import { Injectable, Logger } from "@nestjs/common";
import { TableExtractor } from "../extractor.interface";
import { CompanyAnnouncement } from "./entity/company-announcement";
import { SharedExtractor } from "../shared/shared.extractor";
import { BasicHelperService } from "@app/basic-helper";

@Injectable()
export class CompanyAnnouncementExtractor implements TableExtractor {

    private tableHeader = ['No.', 'Announcement DateAnn. Date', 'Company NameCo. Name', 'Title'];

    private log = new Logger(CompanyAnnouncementExtractor.name);

    constructor(
        private readonly sharedExtractor: SharedExtractor,
        private readonly basicHelper: BasicHelperService
    ) { }
    
    /** obtain the url where the lastest company annoucnment url*/
    latesCompanyAnnouncementURL = (companyCode: string) => {
        return this.getPerPageURL(companyCode, 1,'annDt','desc')
    }

    /** obtain url per  page based on few  parameter */
    private getPerPageURL = (companyCode: string, pageNumber: number, sortBy = 'annDt', sortDiretion = 'desc') => {
        return new URL(`https://www.bursamalaysia.com/market_information/announcements/company_announcement?company=${companyCode}&page=${pageNumber}&sort_by=${sortBy}&sort_dir=${sortDiretion}`);
    }

    private basicCompanyAnnouncementURL = (companyCode: string) => new URL(
        `https://www.bursamalaysia.com/market_information/announcements/company_announcement?company=${companyCode}`
    );

    private firstCompanyAnnouncementPage = async (companyCode: string) => {
        return await  this.basicHelper.loadPage(this.basicCompanyAnnouncementURL(companyCode));
    }

    getAllPageUrl = async (companyCode: string): Promise<URL[]> => {
        const firstPage = await this.firstCompanyAnnouncementPage(companyCode);
        const totalPage = this.sharedExtractor.totalPage(firstPage)

        const URLs = this.basicHelper
            .getFilledArrayWithIncrementalNumber(totalPage)
            .map(pageNumber => this.getPerPageURL(companyCode, pageNumber))
        
        return URLs;
    }

    getLatestAnnouncement = async (companyCode: string): Promise<CompanyAnnouncement> => {
        const latestAnnouncementURL = this.latesCompanyAnnouncementURL(companyCode)
        const $ = await this.basicHelper.loadPage(latestAnnouncementURL);
        return this.extractAnnouncement($)[0];
    }

    tableValidation = ($: CheerioStatic) => {
        let isHeaderValid = true;

        const listOfHeader = $('div')
            .attr('id', 'table-announcements_wrapper')
            .siblings('table').children()
            .first()
            .find('th')
            .map((i, el) => {
                return $(el).text()
            }).get()
            .map((header: string) => header.trim())



        for (let headerIndex = 0; headerIndex < this.tableHeader.length; headerIndex++) {
            const expectedHeaderText = this.tableHeader[headerIndex];
            const pageHeader = listOfHeader[headerIndex];

            if (pageHeader !== expectedHeaderText) {
                isHeaderValid = false;
                throw new Error(`${CompanyAnnouncementExtractor.name} table validation failed at index ${headerIndex}. The expected Header was ${expectedHeaderText} but the page header is ${pageHeader}`);
            }

        }

        return isHeaderValid;

    }


    extractAnnouncement = ($: CheerioStatic) => {
        const listOfAnnouncement: CompanyAnnouncement[] = $(`.main-block`)
            .find('table')
            .attr('id', 'table-announcements')
            .find('tbody')
            .children('tr')
            .map((_trIndex, trElement) => {
                const trContent = $(trElement)
                    .children('td')
                    .map((tdIndex, tdElement) => {

                        switch (tdIndex) {
                            case 3: {
                                const href = $(tdElement)
                                    .find('a')
                                    .attr('href');

                                return href

                            }
                            case 1: {
                                const dateAnnouncement = $(tdElement)
                                    .find('div')
                                    .last()
                                    .text().replace(/\n+/g, "")
                                    .trim();

                                return dateAnnouncement;
                            }
                            default: {
                                const contentText = $(tdElement)
                                    .text()
                                    .replace(/\n+/g, "")
                                    .trim();

                                return contentText;
                            }
                        }

                    }).get();

                const newAnnoucement: CompanyAnnouncement = {
                    companyName: trContent[2],
                    date: new Date(trContent[1]).getTime(),
                    newsUrl: new URL(`https://www.bursamalaysia.com${trContent[3]}`)
                }
                return newAnnoucement
            }).get()

        return listOfAnnouncement;

    }

    pageValidation = ($: CheerioStatic) => {
        return this.tableValidation($);
    }

}