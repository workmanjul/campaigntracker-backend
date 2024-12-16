import { Get, Controller, Query } from '@nestjs/common';
import { AutomationlogService } from './automationlog.service';
import { AutomationLog } from '@prisma/client';

@Controller('automationlog')
export class AutomationlogController {
  constructor(private readonly automationlog: AutomationlogService) {}
  @Get()
  async getAutomationLog(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('sort') sort: any,
    @Query('adsetId') adsetId: string,
  ): Promise<PaginationResponse<AutomationLog>> {
    const res = await this.automationlog.findAllAutomationLog(
      page,
      pageSize,
      fromDate,
      toDate,
      sort,
      adsetId,
    );
    return res;
  }
}
