import { Logger, Module } from '@nestjs/common';
import { AdSetsController } from './ad_sets.controller';
import { AdSetsService } from './ad_sets.service';
import { PaginationModule } from 'src/pagination/pagination.module';
import { AdAccountsService } from 'src/ad_accounts/ad_accounts.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AdSetsController],
  providers: [AdSetsService, AdAccountsService, Logger],
  exports: [AdSetsService],
  imports: [PaginationModule, PrismaModule],
})
export class AdSetsModule {}
