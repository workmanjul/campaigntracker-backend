import { AdSetsService } from './facebook/ad-sets/ad_sets.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DMReportingService } from './external/dm-reporting/dm_reporting.service';
import { AutomationService } from './automation/automation.service';
import { RUN_CRON } from './config';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { PrismaService } from './prisma/prisma.service';
dayjs.extend(timezone);
dayjs.extend(utc);
@Injectable()
export class TrackerCronJob {
  constructor(
    private readonly extAPIService: DMReportingService,
    private readonly dmReportingCronService: DMReportingService,
    private readonly adSetsService: AdSetsService,
    private readonly automationService: AutomationService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleCron(): Promise<any> {
    if (!this.runCron()) {
      return;
    }
    const dateTime = dayjs();
    const previousDate = dateTime.subtract(1, 'day').format('YYYY-MM-DD');
    await this.extAPIService.fetchExternalApiData(previousDate, previousDate);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async adSetsCron(): Promise<void> {
    if (!this.runCron()) {
      return;
    }

    const dateTime = dayjs();
    const currentDate = dateTime.format('YYYY-MM-DD');
    await this.extAPIService.fetchExternalApiData(currentDate, currentDate);
    await this.adSetsService.fetchAdSetsDataFromApi();
  }

  @Cron(CronExpression.EVERY_DAY_AT_5AM) // 1AM EST
  async runAutomationThird(): Promise<void> {
    if (!this.runCron()) {
      return;
    }
    const dateTime = dayjs();
    const currentDate = dateTime.format('YYYY-MM-DD');
    const previousDate = dateTime.subtract(1, 'day').format('YYYY-MM-DD');
    await this.extAPIService.fetchExternalApiData(currentDate, previousDate);
    await this.adSetsService.fetchAdSetsDataFromApi();
    await this.automationService.runAutomation();
  }

  runCron(): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return RUN_CRON === 'yes';
  }

  //Delete Data which is older than 2 days from DmReportingHistory and AdSetHistory

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async cronToDelete(): Promise<void> {
    if (!this.runCron()) {
      return;
    }
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    //Delete Data from DmReportingHistory
    await this.prisma.dmReportingHistory.deleteMany({
      where: {
        createdAt: {
          lt: twoDaysAgo,
        },
      },
    });

    //Delete Data From AdSetHistory

    await this.prisma.adSetsHistory.deleteMany({
      where: {
        createdAt: {
          lt: twoDaysAgo,
        },
      },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async cronToDeletedmReporting(): Promise<void> {
    if (!this.runCron()) {
      return;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await this.prisma.dmReporting.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    await this.prisma.automationLog.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });
  }
}
