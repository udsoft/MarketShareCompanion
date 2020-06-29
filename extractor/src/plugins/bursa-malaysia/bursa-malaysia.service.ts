import { Injectable, Logger} from '@nestjs/common';
import { EquityPageExtractor } from './extract/equity_page/equity-page.extractor';


@Injectable()
export class BursaMalaysiaService {
    
    log = new Logger(BursaMalaysiaService.name);


    constructor(private readonly equityPageExtractor: EquityPageExtractor) { }
    
    getAllStockCodes = () => {
        return this.equityPageExtractor.getAllStockCodes();
    }   

   
}
