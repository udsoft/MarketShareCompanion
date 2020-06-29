import { Controller, Get } from '@nestjs/common';
import { BursaMalaysiaService } from './bursa-malaysia.service';

@Controller('bursa-malaysia')
export class BursaMalaysiaController {
    constructor(private readonly bursaService:BursaMalaysiaService){}

    @Get('companies') 
    async getAllListOfCompanies() {
        return await this.bursaService.updateAllStockCodes();
    }
}
