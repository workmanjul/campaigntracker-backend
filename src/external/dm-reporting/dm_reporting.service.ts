import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import {
  DmReporting,
  v_spendreport,
  DmReportingHistory,
  Prisma,
} from '@prisma/client';
import {
  DM_REPORTING_ACCESS_KEY,
  DM_REPORTING_ACCESS_TOKEN,
  DM_REPORTING_URL,
} from 'src/config';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DataMigrationQuery } from './query';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import advanceFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanceFormat);
@Injectable()
export class DMReportingService {
  constructor(
    private prismaService: PrismaService,
    private readonly paginationService: PaginationService<DmReportingHistory>,

    private readonly spendReportService: PaginationService<v_spendreport>,
    private readonly logger: Logger,
  ) {}

  async fetchExternalApiData(startDate: string, endDate: string): Promise<any> {
    const params = new URLSearchParams();
    params.append('aff', 'hudson interactive');
    params.append('key', DM_REPORTING_ACCESS_KEY);
    params.append('token', DM_REPORTING_ACCESS_TOKEN);
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    const url = DM_REPORTING_URL + params.toString();
    try {
      this.logger.log(
        `Started cron job for History DM Reporting API ${startDate}-${endDate}`,
      );
      const response: AxiosResponse = await axios.get(url);
      if (response) {
        const dataToInsert: DmReportingHistory[] = response.data.map(
          async (record) => {
            const manager = record.Manager || null;
            const recordDate =
              record.Date.substring(0, 10) + ' ' + record.Hour + ':00:00';
            const formattedDate = dayjs.tz(recordDate, 'UTC');
            const createdRecords = this.prismaService.dmReportingHistory.create(
              {
                data: {
                  campaignId: record.Campaign,
                  advertiser: record.Advertiser,
                  domain: record.Domain,
                  manager: manager,
                  buyer: record.Buyer,
                  start_time: formattedDate.toDate(),
                  adset: record.Adset_name,
                  adset_id: record.Adset_Id,
                  revenue: record.Revenue,
                  spend: record.Spend,
                  link_clicks: record.Link_Clicks,
                  ad_clicks: record.Ad_Clicks,
                  gp: record.GP,
                  searches: record.Searches,
                  clicks: record.Clicks,
                  tq: record.TQ,
                  market: record.Market,
                  category: record.Category,
                  createdAt: record.createdAt,
                },
              },
            );
            return createdRecords;
          },
        );
        await Promise.all(dataToInsert);
      }

      await this.prismaService.$executeRaw(Prisma.sql([DataMigrationQuery]));

      this.logger.log('Completed cron job for History DM Reporting API');
      this.logger.log(`Fetched ${response.data.length} entries successfully`);
      return response.data;
    } catch (error) {
      this.logger.debug(error);
      this.logger.error('Failed to fetch data from DM Reporting(History) API');
    }
  }

  async findAll(
    page = 1,
    pageSize = 10,
    fromDate: string = null,
    toDate: string = null,
    sort?: any,
  ): Promise<PaginationResponse<DmReporting>> {
    const skip = (page - 1) * pageSize;
    const take: number = +pageSize;
    let where: any = {};

    if (fromDate !== null && toDate !== null) {
      const fromQueryDate = new Date(fromDate)
        .toISOString()
        .replace('T', ' ')
        .replace('.000Z', '');

      const toQueryDate = new Date(toDate);
      toQueryDate.setUTCHours(23, 59, 59);

      const formattedToDate = toQueryDate
        .toISOString()
        .replace('T', ' ')
        .replace('.000Z', '');

      where = {
        ...where,
        start_time: {
          gte: new Date(fromQueryDate),
          lte: new Date(formattedToDate),
        },
      };
    }

    const items = await this.prismaService.dmReporting.findMany({
      skip,
      take,
      where,
      orderBy: sort ? { [sort.id]: sort.desc === 'true' ? 'desc' : 'asc' } : {},
    });
    const totalItems = await this.prismaService.dmReporting.count();

    return this.paginationService.getPaginationData(
      page,
      pageSize,
      items,
      totalItems,
    );
  }

  async fetchSpendReport(
    page = 1,
    pageSize = 10,
    fromDate: string = null,
    toDate: string = null,
    sort:
      | {
          id: 'string';
          desc: string;
        }
      | undefined,
    adsetId: string,
  ): Promise<PaginationResponse<v_spendreport>> {
    const skip = (page - 1) * pageSize;
    const take: number = +pageSize;
    let where: any = {};

    if (fromDate !== null && toDate !== null) {
      where = {
        ...where,
        reportDate: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      };
    }
    if (adsetId !== '') {
      where = {
        ...where,
        adset_id: {
          equals: adsetId,
        },
      };
    }
    const orderBy: any = {};
    if (sort !== undefined) {
      orderBy[sort.id] = sort.desc === 'true' ? 'desc' : 'asc';
    }
    const items = await this.prismaService.v_spendreport.findMany({
      skip,
      take,
      where,
      orderBy: orderBy,
    });
    const totalItems = await this.prismaService.v_spendreport.count();

    return this.spendReportService.getPaginationData(
      page,
      pageSize,
      items,
      totalItems,
    );
  }
}
