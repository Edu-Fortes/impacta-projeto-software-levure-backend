import { Module } from '@nestjs/common';
import { StartersService } from './starters.service';
import { StartersController } from './starters.controller';

@Module({
  controllers: [StartersController],
  providers: [StartersService],
  exports: [StartersService],
})
export class StartersModule {}
