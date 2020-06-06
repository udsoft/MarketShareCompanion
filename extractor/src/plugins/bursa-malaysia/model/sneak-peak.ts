import { IsString, IsUrl, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SneakPeak{
    @ApiProperty()
    stock_info: StockInfo;
    @ApiProperty()
    company_info: CompanyInfo;
    @ApiProperty()
    announcements: Announcement[];
}

export class StockInfo{
    @IsString()
    board: string;
    @IsString()
    sector: string;
    @IsString()
    market_name: string;
}

export class CompanyInfo{
    @IsString()
    name: string;
    @IsUrl()
    website: string;
    id?: string;
    @IsString()
    _label: string;
}

export class Announcement {
    @IsDate()
    annDt: Date;
    @IsDate()
    annReleaseDT: Date;
    @IsString()
    annTitle: string;
}
    