import { Module } from '@nestjs/common';
import { BursaMalaysiaModule } from './bursa-malaysia/bursa-malaysia.module';

@Module({
  imports: [BursaMalaysiaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
