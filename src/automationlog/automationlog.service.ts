import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AutomationLogDto } from './dto/AutomationLog.dto';
import { Logger } from '@nestjs/common';
import { AutomationLog } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';
import { AutomationData } from './AutomationData';

@Injectable()
export class AutomationlogService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
    private readonly paginationService: PaginationService<AutomationLog>,
  ) {}

  async createAutomationLog(log_data: AutomationData): Promise<AutomationLog> {
    try {
      return await this.prisma.automationLog.create({
        data: {
          automationId: log_data.automationId,
          actionDisplayText: log_data.actionDisplayText,
          rules: log_data.rulesDisplay,
          adset_id: log_data.adSetId,
          action: log_data.action,
          query: log_data.query,
          previous_value: log_data.previous_value,
          new_value: log_data.new_value,
        },
      });
    } catch (error) {
      console.error('Error creating automation log:', error);
      throw error;
    }
  }

  async findAllAutomationLog(
    page: number = 1,
    pageSize: number = 10,
    fromDate: string = null,
    toDate: string = null,
    sort: any,
    adsetId: string,
  ): Promise<PaginationResponse<AutomationLog>> {
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);
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
        createdAt: {
          gte: new Date(fromQueryDate),
          lte: new Date(formattedToDate),
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
    const automationlogs = await this.prisma.automationLog.findMany({
      skip,
      take,
      orderBy: sort ? { [sort.id]: sort.desc === 'true' ? 'desc' : 'asc' } : {},
      where,
    });
    const totalItems = await this.prisma.automationLog.count(); // Count total number of items

    return this.paginationService.getPaginationData(
      page,
      pageSize,
      automationlogs,
      totalItems,
    );
  }
}
