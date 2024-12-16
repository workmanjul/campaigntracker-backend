import { Logger, Module } from '@nestjs/common';
import { AutomationlogController } from './automationlog.controller';
import { AutomationlogService } from './automationlog.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { PaginationModule } from 'src/pagination/pagination.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AutomationlogController],
  providers: [AutomationlogService, PaginationService, Logger],
  exports: [AutomationlogService],
  imports: [PaginationModule, PrismaModule],
})
export class AutomationlogModule {}
