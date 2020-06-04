import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import cheerio = require('cheerio');
import Axios from 'axios';


@Injectable()
export class BursaMalaysiaService {
    log = new Logger(BursaMalaysiaService.name);
    private readonly HOMEPAGE_URL: URL = new URL('https://www.bursamalaysia.com');
    private readonly EQUITIES_PRICE_URL: URL = new URL('https://www.bursamalaysia.com/market_information/equities_prices');
    private readonly EQUITIES_PRICE_HEADER: string[] = [
        "NO", "NAME", "CODE",
        "REM", "LAST DONE", "LACP",
        "CHG", "%CHG", "VOL ('00)",
        "BUY VOL ('00)", "BUY", "SELL",
        "SELL VOL ('00)", "HIGH", "LOW", "stock_id"
    ];
    private readonly TITLE = 'Equities Prices';

    public async getAllStockCodes() {
        //1. load the main equity page
        const $mainEquity = await this.loadPageAsCheerio(this.EQUITIES_PRICE_URL)
        //2. get the total page\
        const totalPage = this.getTotalPage($mainEquity);
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

    /**
     * Browser the url using the href and load the cheerio static.
     * @param url Url which need to be loaded as cheerio static
     */
    public async loadPageAsCheerio(url: URL): Promise<CheerioStatic> {
        const href = url.href;
        const html = (await Axios.get(href)).data;
        const $ = cheerio.load(html);
        return $;
    }

    /**
     * Get the total pages available to get all the company code.
     * @param $ html page loaded in cheerio library
     */
    public getTotalPage($: CheerioStatic): number {
        const totalPage = $("#total_page").attr('data-val');
        return parseInt(totalPage, 10)
    }

    /**
     * Get the Equity Price URL with the search param for each given page number
     * @param pageNumber the page number
     */
    public getEquityPriceUrlForGivenPageNumber(pageNumber: number) {
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

    /**
     * Check if the table in the page is not change 
     * from the time this scrapper was developed
     * @param $ Equities Price Page Cheerio Static
     */
    public validateTableHeaderOfEquityPricePage($: CheerioStatic) {
        const extractedTableHeader = $('table.equity_prices_table > thead > tr')
            .toArray()[0]
            .children
            .filter(trElement => trElement.name === "th")
            .map(thElement => 
                 thElement.children.map(child => child.data)[0]
            )
        
        // looping thru extracted Table header and the one should be. If mismatch return false.
        for (let headerIndix = 0; headerIndix < extractedTableHeader.length; headerIndix++) {
            const extractedHeader = extractedTableHeader[headerIndix]
                .toLowerCase();
            
            const shouldBeHeader = this.EQUITIES_PRICE_HEADER[headerIndix]
                .toLowerCase();
            
            if (extractedHeader !== shouldBeHeader) {
                throw new HttpException(`Table Header is changed. Expected:${shouldBeHeader}
                but gotten ${extractedHeader}`,
                    HttpStatus.EXPECTATION_FAILED);
            }
        }
        return true;
    }

}
