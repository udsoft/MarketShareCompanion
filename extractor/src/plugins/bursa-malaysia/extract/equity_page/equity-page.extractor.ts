import { BasicHelperService } from "@app/basic-helper";
import { map, filter } from "ramda";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class EquityPageExtractor {

    constructor(private readonly basicHelper: BasicHelperService) { }

    private readonly EQUITIES_PRICE_URL: URL = new URL('https://www.bursamalaysia.com/market_information/equities_prices');
    private readonly EQUITIES_PRICE_HEADER: string[] = [
        "NO", "NAME", "CODE",
        "REM", "LAST DONE", "LACP",
        "CHG", "%CHG", "VOL ('00)",
        "BUY VOL ('00)", "BUY", "SELL",
        "SELL VOL ('00)", "HIGH", "LOW", "stock_id"
    ];
    
    public async getAllStockCodes() {
        //1. load the main equity page
        const $mainEquity = await this.basicHelper.loadPage(this.EQUITIES_PRICE_URL)

        //2. get the total page\
        const totalPage = this.getTotalPage($mainEquity);

        const pagesURLs = this.basicHelper
            .getFilledArrayWithIncrementalNumber(totalPage)
            .map(pageNumber => {
                return this.getEquityPriceUrlForGivenPageNumber(pageNumber)
            })
        
        const getCompanyCodes = async (url: URL) => {
            const $page = await this.basicHelper.loadPage(url);
            return await this.extractCompanyCodesInThePage($page);
        }

        // TODO Derive this to make saving to the database at each function call of getCompanyCodes.
        let companyCode: string[] = []
        for (let index = 0; index < pagesURLs.length; index++) {
            const url = pagesURLs[index];
            companyCode = companyCode.concat(await getCompanyCodes(url));
        }
        console.log(companyCode);
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
        
        const extractCompanyCodeFromRow = (row: CheerioElement) => {
            return row.children[0].data;
        }

        const listOfCompanyCodeInThisPage = map(extractCompanyCodeFromRow, listOfRows);

        return listOfCompanyCodeInThisPage;
    }

    /**
     * Check if the table in the page is not change 
     * from the time this scrapper was developed
     * @param $ Equities Price Page Cheerio Static
     */
    public validateTableHeaderOfEquityPricePage($: CheerioStatic) {
        const isTableHeader = (tableRow: CheerioElement) => tableRow.name === 'th';
        
        const getTextFromTableHeader = (thElement: CheerioElement) => {
            return thElement.children.map(child => child.data)[0]
        }

        const tableRows = $('table.equity_prices_table > thead > tr').toArray()[0].children
        const tableHeaders = filter(isTableHeader, tableRows);
        const allHeaderTexts = map(getTextFromTableHeader, tableHeaders);
           

        for (let headerIndix = 0; headerIndix < allHeaderTexts.length; headerIndix++) {
            const extractedHeader = allHeaderTexts[headerIndix]
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