import { Injectable } from "@nestjs/common";

@Injectable()
export class CompanyProfileExtractor {

    getCompanyFullName = ($: CheerioStatic) => {
        return $('.main-block section')
            .last()
            .find('.col-lg-3')
            .find('h5')
            .text()
    }

    getMarket = ($: CheerioStatic) => {
        return $('.main-block section')
            .last()
            .find('.col-lg-3')
            .find('div')
            .first()
            .next()
            .text()
            .split(':')[1]
            .trim();
    }

    getSector = ($: CheerioStatic) => {
        return $('.main-block section')
            .last()
            .find('.col-lg-3')
            .find('div')
            .first()
            .next().next()
            .text()
            .split(':')[1]
            .trim();
    }
}