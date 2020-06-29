import { Module, HttpModule } from '@nestjs/common';
import { BursaMalaysiaService } from './bursa-malaysia.service';
import { BursaMalaysiaController } from './bursa-malaysia.controller';
import { BasicHelperModule } from '@app/basic-helper';
import { EquityPageExtractor } from './extract/equity_page/equity-page.extractor';
import { SharedExtractor } from './extract/shared/shared.extractor';

@Module({
  imports:[HttpModule,BasicHelperModule],
  providers: [
    BursaMalaysiaService,
    EquityPageExtractor,
    SharedExtractor
  ],
  controllers: [BursaMalaysiaController]
})
export class BursaMalaysiaModule {}
