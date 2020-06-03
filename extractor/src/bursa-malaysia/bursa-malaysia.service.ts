import { Injectable, Logger } from '@nestjs/common';
import cheerio = require('cheerio');
import Axios from 'axios';

@Injectable()
export class BursaMalaysiaService {
    log = new Logger(BursaMalaysiaService.name);
    private readonly HOMEPAGE_URL: URL = new URL('https://www.bursamalaysia.com');
    private readonly EQUITIES_PRICE_URL: URL = new URL('https://www.bursamalaysia.com/market_information/equities_prices');

    public async getAllStockCodes() {
        //1. load the main equity page
        const $mainEquity = await this.loadPageAsCheerio(this.EQUITIES_PRICE_URL)
        //2. get the total page\
        const totalPage = await this.getTotalPage($mainEquity);
        //3. from each page extract the codes
        const pagesURLs = Array(totalPage)
            .fill(0)
            .map((e, i) => {
                const pageNumber = i + 1;
                return pageNumber;
            })
            .map(pageNumber => {
                return this.getEquityPriceUrlForGivenPageNumber(pageNumber)
            })

        pagesURLs.forEach(async (pageURL) => {
            const $page = await this.loadPageAsCheerio(pageURL);
            const stockCodesInPage = this.extractCompanyCodesInThePage($page);
            
        })

    }

    private async loadPageAsCheerio(url: URL): Promise<CheerioStatic> {
        const href = url.href;
        const html = (await Axios.get(href)).data;
        const $ = cheerio.load(html);
        return $;
    }

    public async getTotalPage($: CheerioStatic) {
        const totalPage = $("#total_page").attr('data-val');
        return parseInt(totalPage, 10)
    }

    public getEquityPriceUrlForGivenPageNumber(pageNumber: number){
        const nextEquityPageUrl = new URL(this.EQUITIES_PRICE_URL.href);;
        nextEquityPageUrl.searchParams.set('page', pageNumber.toString())
        return nextEquityPageUrl;
    }

    /**
     * Get All Company code in the available path.
     * @param tableUrl The URL Page where the extraction of data should run.
     */
    public async extractCompanyCodesInThePage($: CheerioStatic): Promise<string[]> {
        const listOfRows = $('td.stock-id').toArray();
        const listOfCompanyCodeInThisPage: string[] = [];
        for (let rowIndex = 0; rowIndex < listOfRows.length; rowIndex++) {
            const row$ = listOfRows[rowIndex];
            const companyCode = row$.children[0].data;
            listOfCompanyCodeInThisPage.push(companyCode);
        }
        return listOfCompanyCodeInThisPage;
    }

}
