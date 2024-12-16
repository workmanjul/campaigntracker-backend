import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdSetsService } from './ad_sets.service';
import { AdSets } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('ad-sets')
@UseGuards(AuthGuard('jwt'))
export class AdSetsController {
  constructor(private readonly adSetsService: AdSetsService) {}

  @Get()
  async getAdSetsData(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('sort') sort: any,
    @Query('adsetAccount') adsetAccount: any,
  ): Promise<PaginationResponse<AdSets>> {
    const resp = await this.adSetsService.getAdSetsData(
      page,
      pageSize,
      fromDate,
      toDate,
      sort,
      adsetAccount,
    );
    return resp;
  }
}
