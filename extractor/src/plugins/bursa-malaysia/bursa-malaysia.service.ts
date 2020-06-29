import { Injectable, Logger, NotImplementedException} from '@nestjs/common';
import { EquityPageExtractor } from './extract/equity_page/equity-page.extractor';


@Injectable()
export class BursaMalaysiaService {
    
    log = new Logger(BursaMalaysiaService.name);


    constructor(private readonly equityPageExtractor: EquityPageExtractor) { }
    
    /**
     * cross check if with database if all stock code is saved to database.
     * if not save to database.
     */
    updateAllStockCodes = () => {
        return this.equityPageExtractor.getAllStockCodes();
    }

    /**
     * Check with the database if the latest annoucement is been saved to the database.
     * If not added add the latest annoucement to the database.
     */
    updateLatestAnnoucement = () => {
        throw new NotImplementedException();
    }

    /**
     * Check if the company profile is still valid as per data saved in the database.
     * if the name of the company is changed , rename the data and the previous name
     * of the company is stored in company profile as previous name object
     * history_name: [{
     *     knownas:${name},
     *     changesAt: new Data(Date.now)
     * }, {...}]
     * 
     */
    updateCompanyProfile = () => {
        throw new NotImplementedException()
    }

    



   
}
