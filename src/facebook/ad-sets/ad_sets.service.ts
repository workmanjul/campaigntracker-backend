import { Inject, Injectable, Logger } from '@nestjs/common';
import { AdAccountsService } from 'src/ad_accounts/ad_accounts.service';
import { FACEBOOK_ACCESS_TOKEN, FACEBOOK_API_URL } from 'src/config';
import axios, { AxiosResponse } from 'axios';
import { PaginationService } from 'src/pagination/pagination.service';
import { AdSets, AdSetsHistory, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { DataMigrationQuery } from '../../external/dm-reporting/query';
import { SyncQuery } from './query';

@Injectable()
export class AdSetsService {
  constructor(
    @Inject(AdAccountsService)
    private readonly adAccountService: AdAccountsService,

    private readonly logger: Logger,
    private readonly paginationService: PaginationService<AdSets>,
    private prisma: PrismaService,
  ) { }
  async fetchAdSetsDataFromApi(): Promise<any> {

    const adAccountData = await this.adAccountService.findAllAccounts();

    if (adAccountData) {
      const result = adAccountData.map(async (adAccount) => {
        const accountId = adAccount.accountId;
        const url =
          FACEBOOK_API_URL +
          'act_' +
          accountId +
          '/adsets?fields=status,name,daily_budget,created_time,start_time,targeting&limit=400&access_token=' +
          FACEBOOK_ACCESS_TOKEN;
        console.log(url);
        try {
          this.logger.log('Started cron job for Facebook AdSetsHistory API');
          const response: AxiosResponse = await axios.get(url);
          if (response) {
            const promises: AdSetsHistory[] = response.data.data.map(
              async (record) => {
                const adsetID = record.id

                const existingAdsetID = await this.prisma.budgetAdjustment.findUnique({
                  where: {
                    adset_id: adsetID,
                  }
                })

                if (!existingAdsetID) {
                  await this.prisma.budgetAdjustment.create({
                    data: {
                      adset_id: adsetID,
                      last_budget_adjustment: null
                    }
                  })
                }

                const startTime = new Date(record.start_time);
                const createdTime = new Date(record.created_time);
                const adSetDataHistory = await this.prisma.adSetsHistory.create(
                  {
                    data: {
                      adset_id: adsetID,
                      status: record.status,
                      name: record.name,
                      country: record.targeting.geo_locations.countries,
                      daily_budget: Number(record.daily_budget),
                      created_time: createdTime,
                      start_time: startTime,
                      adaccount_id: accountId,
                    },
                  },
                );
                return adSetDataHistory;
              },
            );
            await Promise.all(promises);

            this.logger.log(
              `Fetched ${response.data.data.length} facebook entries successfully`,
            );
            this.logger.log(
              'Completed cron job for Facebook AdSetsHistory API',
            );
          }
        } catch (error) {
          this.logger.debug(error);
          this.logger.error('Failed to fetch data from Facebook API(History)');
        }
      });
      await Promise.all(result);
      await this.prisma.$executeRaw(Prisma.sql([SyncQuery]));
    }
  }

  async getAdSetsData(
    page = 1,
    pageSize = 10,
    fromDate: string = null,
    toDate: string = null,
    sort?: any,
    adsetAccount?: any
  ): Promise<PaginationResponse<AdSets>> {
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

      // Add the adsetAccount filter to the where condition
    if (adsetAccount) {
      where = {
        ...where,
        adaccount_id: adsetAccount,
      };
    }
    }

    const adSets = await this.prisma.adSets.findMany({
      skip,
      take,
      where,
      orderBy: sort ? { [sort.id]: sort.desc === 'true' ? 'desc' : 'asc' } : {},
    });
    const totalItems = await this.prisma.adSets.count(); // Count total number of items
    return this.paginationService.getPaginationData(
      page,
      pageSize,
      adSets,
      totalItems,
    );
  }
}
