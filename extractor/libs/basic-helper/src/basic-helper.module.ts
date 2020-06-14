import { Module } from '@nestjs/common';
import { BasicHelperService } from './basic-helper.service';

@Module({
  providers: [BasicHelperService],
  exports: [BasicHelperService],
})
export class BasicHelperModule {}
