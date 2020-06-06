import { Module, HttpModule } from '@nestjs/common';
import { BursaMalaysiaService } from './bursa-malaysia.service';
import { BursaMalaysiaController } from './bursa-malaysia.controller';

@Module({
  imports:[HttpModule],
  providers: [BursaMalaysiaService],
  controllers: [BursaMalaysiaController]
})
export class BursaMalaysiaModule {}
