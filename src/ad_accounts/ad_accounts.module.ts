import { Module } from '@nestjs/common';
import { AdAccountsController } from './ad_accounts.controller';
import { AdAccountsService } from './ad_accounts.service';
import { PaginationModule } from 'src/pagination/pagination.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaginationService } from 'src/pagination/pagination.service';

@Module({
  providers: [AdAccountsService, PaginationService],
  controllers: [AdAccountsController],
  exports: [AdAccountsService],
  imports: [PaginationModule, PrismaModule],
})
export class AdAccountsModule {}
