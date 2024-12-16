import { Get, Controller, Query, Post, Body, Param } from '@nestjs/common';
import { ManualAdjService } from './manual-adj.service';
import { ManualAdjDto } from './dto/manual-adj.dto';
import { ManualLog } from '@prisma/client';

@Controller('manual-adj')
export class ManualAdjController {

    constructor(private readonly manualAdj: ManualAdjService) { }

    @Get()
    async getAllManualAdj(
        @Query('page') page: number,
        @Query('pageSize') pageSize: number,
        @Query('fromDate') fromDate: string,
        @Query('toDate') toDate: string,
        @Query('sort') sort: any,
        @Query('AdsetName') AdsetName: string,
        @Query('day') day: string,
        @Query('facebook_campaign') facebook_campaign: string,
        @Query('term_filter') term_filter: string,
        @Query('spend_min') spend_min: string,
        @Query('spend_max') spend_max: string,
        @Query('rpc_min') rpc_min: string,
        @Query('rpc_max') rpc_max: string,
        @Query('margin_min') margin_min: string,
        @Query('margin_max') margin_max: string,
        @Query('gp_min') gp_min: string,
        @Query('gp_max') gp_max: string,
        @Query('ctr_min') ctr_min: string,
        @Query('ctr_max') ctr_max: string,


    ) {
        const res = await this.manualAdj.getAllAutomations(
            page,
            pageSize,
            sort,
            day,
            facebook_campaign,
            term_filter,
            spend_min,
            spend_max,
            rpc_min,
            rpc_max,
            margin_min,
            margin_max,
            gp_min,
            gp_max,
            ctr_min,
            ctr_max
        )
        return res
    }
    @Post()
    async postManualAdj(
        @Body() manualadjData: ManualAdjDto[]
    ) {
        return this.manualAdj.storeManualData(manualadjData)
    }

    @Get('manual-log')
    async getAutomationLog(
        @Query('page') page: number,
        @Query('pageSize') pageSize: number,
        @Query('fromDate') fromDate: string,
        @Query('toDate') toDate: string,
        @Query('sort') sort: any,
        @Query('adsetId') adsetId: string,
    ): Promise<PaginationResponse<ManualLog>> {
        const res = await this.manualAdj.findAllManualLog(
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

