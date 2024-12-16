import { Logger, Module } from '@nestjs/common';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaginationModule } from 'src/pagination/pagination.module';
import { AutomationlogService } from 'src/automationlog/automationlog.service';

@Module({
  controllers: [AutomationController],
  providers: [AutomationService, Logger,AutomationlogService],
  imports: [PrismaModule, PaginationModule],
  exports: [AutomationService],
})
export class AutomationModule {}
