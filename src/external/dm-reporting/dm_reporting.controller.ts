import { Controller, Get, UseGuards, Query } from '@nestjs/common';

import { DMReportingService } from './dm_reporting.service';
import { DmReporting, v_spendreport } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(timezone);
dayjs.extend(utc);
@Controller('campaigns')
@UseGuards(AuthGuard('jwt'))
export class DMReportingController {
  constructor(private readonly dmReportingService: DMReportingService) {}

  @Get()
  async fetchExternalApiData(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('sort') sort: any,
  ): Promise<PaginationResponse<DmReporting>> {
    const resp = await this.dmReportingService.findAll(
      page,
      pageSize,
      fromDate,
      toDate,
      sort,
    );
    return resp;
  }

  @Get('/spend-report')
  async fetchReport(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('adsetId') adsetId: string,
    @Query('sort')
    sort:
      | {
          id: 'string';
          desc: string;
        }
      | undefined,
  ): Promise<PaginationResponse<v_spendreport>> {
    const resp = await this.dmReportingService.fetchSpendReport(
      page,
      pageSize,
      fromDate,
      toDate,
      sort,
      adsetId,
    );
    return resp;
  }

  @Get('/test')
  async test() {
    const dateTime = dayjs();
    for (let i = 0; i < 10; i++) {
      const startDate = dateTime.subtract(i, 'day').format('YYYY-MM-DD');
      await this.dmReportingService.fetchExternalApiData(startDate, startDate);
    }
    // const startDate = '2023-06-14';
  }
}
