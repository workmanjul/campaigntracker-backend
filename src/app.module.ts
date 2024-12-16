import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdAccountsModule } from './ad_accounts/ad_accounts.module';
import { TrackerCronJob } from './cron-job';
import { DMReportingModule } from './external/dm-reporting/dm_reporting.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PaginationModule } from './pagination/pagination.module';
import { AdSetsModule } from './facebook/ad-sets/ad_sets.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { AutomationModule } from './automation/automation.module';
import { AutomationlogModule } from './automationlog/automationlog.module';
import { CategoryRpcModule } from './category-rpc/category-rpc.module';
import { ManualAdjModule } from './manual-adj/manual-adj.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    DMReportingModule,
    AdAccountsModule,
    PaginationModule,
    AdSetsModule,
    PrismaModule,
    AutomationModule,
    AutomationlogModule,
    CategoryRpcModule,
    ManualAdjModule,
  ],
  controllers: [AppController],
  providers: [AppService, TrackerCronJob, Logger, PrismaService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit(): Promise<void> {}
}
