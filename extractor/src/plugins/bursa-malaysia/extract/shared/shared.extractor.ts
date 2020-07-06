import { Injectable } from "@nestjs/common";

@Injectable()
export class SharedExtractor {

    /**
    * Get the total pages available to get all the company code.
    * @param $ html page loaded in cheerio library
    */
    totalPage = ($: CheerioStatic): number => {
        const totalPage = $("#total_page").attr('data-val');
        return parseInt(totalPage, 10)
    }

}
