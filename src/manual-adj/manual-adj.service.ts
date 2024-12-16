import { Injectable, Logger } from '@nestjs/common';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ManualAdjData } from './ManualAdjData';
import { ManualAdjDto } from './dto/manual-adj.dto';
import { Prisma, ManualLog } from '@prisma/client';
import { FACEBOOK_ACCESS_TOKEN, FACEBOOK_API_URL } from 'src/config';
import axios, { AxiosResponse } from 'axios';
@Injectable()
export class ManualAdjService {
  constructor(

    private prisma: PrismaService,
    private readonly logger: Logger,
    private readonly paginationService: PaginationService<ManualLog>,
    private readonly paginationServices: PaginationService<ManualAdjData>

  ) { }

  async storeManualData(data: ManualAdjDto[]): Promise<void> {
    const responseData = data.map(async (items) => {
      
      // Case I: when new_budget is present for adset_id
      if (Number(items.new_budget)) {
        let status = "SUCCESS";
        let remarks = "Successfully executed";
        if (!items.post_to_database) {
          let body = { daily_budget: items.new_budget }
          const url = `${FACEBOOK_API_URL}${items.adset_id}?access_token=${FACEBOOK_ACCESS_TOKEN}&fields=id,name,status,daily_budget`;
          try {
            const response: AxiosResponse = await axios.post(url, body);
            this.logger.log(
              `Adset ${items.adset_id} status updated to ${JSON.stringify(body)}`,
            );
            const currentTime = new Date();
            if (response.status === 200) {
              await this.prisma.budgetAdjustment.update({
                where: { adset_id: items.adset_id },
                data: { last_budget_adjustment: currentTime }
              });
            }
            
          } catch (error) {
            status = "FAIL";
            remarks = error.message;
            this.logger.error(error.stack);
          }
        }
        // Log to Database
        await this.logToDatabase((items.adset_id), `New Budget Adjusted to ${items.new_budget}`, Number(items.new_budget),status,remarks)
      }

      // Case II: When only duplicate is provided
      if (Number(items.duplicate) && !Number(items.duplicate_budget) && !Number(items.new_budget)) {
        let status = "SUCCESS";
        let remarks = "Successfully executed";
        let new_adset_ids = [];
        if (!items.post_to_database) {
          for (let i = 1; i <= items.duplicate; i++) {
            try {
              const url = `${FACEBOOK_API_URL}${items.adset_id}/copies?access_token=${FACEBOOK_ACCESS_TOKEN}`;
              const adsetName = items.adset_name;
              const updatedName = this.getNewAdSetName(adsetName,i);
              
              const response: AxiosResponse = await axios.post(url);
              const copied_adset_id = response.data.copied_adset_id;
              new_adset_ids.push(copied_adset_id);
              this.logger.log(`From ${items.adset_id} a Duplicate adset ${copied_adset_id} is created.`)
              
              let body = {
                name: updatedName,
                status: 'ACTIVE'
              }
              const update_url = `${FACEBOOK_API_URL}${copied_adset_id}?access_token=${FACEBOOK_ACCESS_TOKEN}`;
              const update_response: AxiosResponse = await axios.post(update_url,body);

            } catch (error) {
              status = "FAIL";
              remarks = error.message;
              this.logger.error(error.stack);
            }
          }
        }
        await this.logToDatabase((items.adset_id), `${items.duplicate} new adsets has been created from Adset_id:${items.adset_id} with new budget as ${items.current_budget} as: \n ${new_adset_ids.join("\n")}`, Number(items.current_budget),status,remarks)
      }

      // Case III: When duplicate and duplicate_budget is provided
      if (Number(items.duplicate) && Number(items.duplicate_budget)) {
        let status = "SUCCESS";
        let remarks = "Successfully executed";
        let new_adset_ids = [];

        if (!items.post_to_database) {
          const url = `${FACEBOOK_API_URL}${items.adset_id}/copies?access_token=${FACEBOOK_ACCESS_TOKEN}`;
          
          for (let i = 1; i <= items.duplicate; i++) {
            try {
              const url = `${FACEBOOK_API_URL}${items.adset_id}/copies?access_token=${FACEBOOK_ACCESS_TOKEN}`;
              const adsetName = items.adset_name;
              const updatedName = this.getNewAdSetName(adsetName,i);
              
              const response: AxiosResponse = await axios.post(url);
              const copied_adset_id = response.data.copied_adset_id;
              new_adset_ids.push(copied_adset_id);
              this.logger.log(`From ${items.adset_id} a Duplicate adset ${copied_adset_id} is created.`)
              
              let body = {
                daily_budget: items.duplicate_budget,
                name: updatedName,
                status: 'ACTIVE'
              }
              const update_url = `${FACEBOOK_API_URL}${copied_adset_id}?access_token=${FACEBOOK_ACCESS_TOKEN}`;
              const update_response: AxiosResponse = await axios.post(update_url,body);

            } catch (error) {
              status = "FAIL";
              remarks = error.message;
              this.logger.error(error.stack);
            }
          }
        }
        await this.logToDatabase((items.adset_id), `${items.duplicate} new adsets has been created from Adset_id:${items.adset_id} with new budget as ${items.duplicate_budget}  as: \n ${new_adset_ids.join("\n")}`, Number(items.duplicate_budget),status,remarks)
      }
    })

  }
  async logToDatabase(adsetId: string, action: string, newBudget: number,status: string,remarks: string): Promise<void> {
    await this.prisma.manualLog.create({
      data: {
        adset_id: adsetId,
        action: action,
        new_budget: newBudget,
        created_time: new Date(),
        status: status,
        remarks: remarks,
      },
    });
  }

  async getAllAutomations(
    page: number = 1,
    pageSize: number = 10,
    sort: any,
    day: string = "",
    facebook_campaign: string = "",
    term_filter: string = "",
    spend_min: string = '',
    spend_max: string = '',
    rpc_min: string = '',
    rpc_max: string = '',
    margin_min: string = '',
    margin_max: string = '',
    gp_min: string = '',
    gp_max: string = '',
    ctr_min: string = '',
    ctr_max: string = '',

  ) {

    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);

    const whereData = {
      day: day,
      facebook_campaign: facebook_campaign,
      term_filter: term_filter,

    }

    const havingData = {
      spend_min: spend_min,
      spend_max: spend_max,
      rpc_min: rpc_min,
      rpc_max: rpc_max,
      margin_min: margin_min,
      margin_max: margin_max,
      gp_min: gp_min,
      gp_max: gp_max,
      ctr_min: ctr_min,
      ctr_max: ctr_max
    }
    let whereQuery = this.generateWhereQuery(whereData)

    let havingQuery = this.generateHavingQuery(havingData)

    let orderByColumn = 'gp'
    let orderByDirection = 'asc';

    if (sort) {
      const validSortColumns = ['gp', 'RPC', 'CPA', 'Spend', 'Revenue', 'Margin', 'AdClicks', 'Current_Budget', 'adset_id'];


      if (validSortColumns.includes(sort.column)) {
        orderByColumn = sort.column
      }

      if (sort.direction === 'desc') {
        orderByDirection = 'desc'
      }
    }

    let queryStr = `
    SELECT
          cast(t1.start_time AS date) AS report_date,
          sum(t1.gp) as gp,
          (
          SELECT RPC
          FROM CategoryRPC
          WHERE category = t1.category AND country = t1.market
          LIMIT 1
        ) AS RPC,
          t2.name as AdsetName,
          10 as CTR,
        COALESCE((SUM(t1.spend) / SUM(t1.ad_clicks)),0) AS CPA,
          SUM(t1.spend) AS Spend,
          SUM(t1.revenue) AS Revenue,
          (
          COALESCE((SUM(t1.revenue) - SUM(t1.spend)) / NULLIF(SUM(t1.revenue), 0), 0)
        ) * 100 AS Margin,
          SUM(t1.link_clicks) AS AdClicks,
          t2.daily_budget AS Current_Budget,
          (to_days(NOW()) - to_days(t2.start_time)) AS daysPassed,
          t1.adset_id,
        t4.last_budget_adjustment
    FROM
    DmReporting t1
      JOIN AdSets t2 ON t1.adset_id = t2.adset_id
      JOIN BudgetAdjustment t4 ON t1.adset_id = t4.adset_id
    ${whereQuery}
    GROUP BY
	    cast(t1.start_time AS date),
      t1.adset_id
      ${havingQuery}
    ORDER BY ${orderByColumn} ${orderByDirection}
    LIMIT ${skip}, ${take};`

    const query = Prisma.raw(queryStr);
    console.log(queryStr);

    const dataFromquery: any = await this.prisma.$queryRaw(query);

    const mappedData: ManualAdjData[] = dataFromquery.map((row) => ({
      gp: row.gp,
      RPC: row.RPC,
      CPA: row.CPA,
      Spend: row.Spend,
      Revenue: row.Revenue,
      Margin: row.Margin,
      AdClicks: row.AdClicks,
      Current_Budget: row.Current_Budget,
      adset_id: row.adset_id,
      AdsetName: row.AdsetName,
      last_budget_adjustment: row.last_budget_adjustment,
    }));

    const totalItems = mappedData.length

    const currentPageData = mappedData.slice(skip, skip + pageSize);
    const paginationResponse = await this.paginationServices.getPaginationData(
      page,
      pageSize,
      currentPageData,
      totalItems
    );
    return paginationResponse
  }

  generateHavingQuery(havingData) {

    const havingConditions = [];

    // Case: spend_min and spend_max
    if (havingData.spend_min !== '' && havingData.spend_max !== '') {
      havingConditions.push(`Spend BETWEEN ${havingData.spend_min} AND ${havingData.spend_max}`);
    }

    //Case when spend_min is only present
    if (havingData.spend_min !== '' && havingData.spend_max == '') {
      havingConditions.push(`Spend >= ${havingData.spend_min}`);
    }

    //Case when spend_max is only present
    if (havingData.spend_min == '' && havingData.spend_max !== '') {
      havingConditions.push(`Spend <= ${havingData.spend_max}`);
    }

    // Case: rpc_min and rpc_max
    if (havingData.rpc_min !== '' && havingData.rpc_max !== '') {
      havingConditions.push(`RPC BETWEEN ${havingData.rpc_min} AND ${havingData.rpc_max}`);
    }

    //Case when rpc_min is only present
    if (havingData.rpc_min !== '' && havingData.rpc_max == '') {
      havingConditions.push(`RPC >= ${havingData.rpc_min}`);
    }

    //Case when rpc_max is only present
    if (havingData.rpc_min == '' && havingData.rpc_max !== '') {
      havingConditions.push(`RPC <= ${havingData.rpc_max}`);
    }

    // Case: margin_min and margin_max
    if (havingData.margin_min !== '' && havingData.margin_max !== '') {
      havingConditions.push(`Margin BETWEEN ${havingData.margin_min} AND ${havingData.margin_max}`);
    }

    //Case when margin_min is only present
    if (havingData.margin_min !== '' && havingData.margin_max == '') {
      havingConditions.push(`Margin >= ${havingData.margin_min}}`);
    }

    //Case when margin_max is only present
    if (havingData.margin_min == '' && havingData.margin_max !== '') {
      havingConditions.push(`Margin <= ${havingData.margin_max}}`);
    }

    // Case: gp_min and gp_max
    if (havingData.gp_min !== '' && havingData.gp_max !== '') {
      havingConditions.push(`t1.gp BETWEEN ${havingData.gp_min} AND ${havingData.gp_max}`);
    }

    //Case when gp_min is only present
    if (havingData.gp_min !== '' && havingData.gp_max == '') {
      havingConditions.push(`t1.gp >= ${havingData.gp_min}}`);
    }

    //Case when gp_max is only present
    if (havingData.gp_min == '' && havingData.gp_max !== '') {
      havingConditions.push(`t1.gp <= ${havingData.gp_max}}`);
    }

    // Case: ctr_min and ctr_max
    if (havingData.ctr_min !== '' && havingData.ctr_max !== '') {
      havingConditions.push(`CTR BETWEEN ${havingData.ctr_min} AND ${havingData.ctr_max}`);
    }

    //Case when gtr_min is only present
    if (havingData.ctr_min !== '' && havingData.ctr_max == '') {
      havingConditions.push(`CTR >= ${havingData.ctr_min}}`);
    }

    //Case when gtr_min is only present
    if (havingData.ctr_min !== '' && havingData.ctr_max == '') {
      havingConditions.push(`CTR <= ${havingData.ctr_min}}`);
    }
    return havingConditions.length > 0 ? `HAVING ${havingConditions.join(' AND ')}` : '';


  }
  generateWhereQuery(whereData) {
    let conditions = []

    if (whereData.day === 'today') {
      const today = new Date()
      const formattedDate = today.toISOString().split('T')[0];
      conditions.push(`cast(t1.start_time AS date) = '${formattedDate}'`)
    } else if (whereData.day == 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayFormatted = yesterday.toISOString().split('T')[0]
      conditions.push(`cast(t1.start_time AS date) = '${yesterdayFormatted}'`)
    }

    if (whereData.facebook_campaign !== '') {
      conditions.push(`t2.name = '${whereData.facebook_campaign}'`)
    }

    if (whereData.term_filter !== '') {
      conditions.push(`t2.name LIKE '%${whereData.term_filter}%'`)
    }

    return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  }


  async findAllManualLog(
    page: number = 1,
    pageSize: number = 10,
    fromDate: string = null,
    toDate: string = null,
    sort: any,
    adsetId: string,
  ): Promise<PaginationResponse<ManualLog>> {
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
        created_time: {
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
    const manuallogs = await this.prisma.manualLog.findMany({
      skip,
      take,
      orderBy: sort ? { [sort.id]: sort.desc === 'true' ? 'desc' : 'asc' } : {},
      where,
    });
    const totalItems = await this.prisma.automationLog.count(); // Count total number of items

    return this.paginationService.getPaginationData(
      page,
      pageSize,
      manuallogs,
      totalItems,
    );
  }

  // Helper function to generate current date in a specified format
   getNewAdSetName(adset_name: string, index: number) {
    var parts = adset_name.split(' - ');

    // Removing Last part of the string if it matches the format
    if (parts.length === 3) {
      parts.pop();
    }
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    var day = currentDate.getDate().toString().padStart(2, '0');

    var hours = currentDate.getHours().toString().padStart(2, '0');
    var minutes = currentDate.getMinutes().toString().padStart(2, '0');
    var seconds = currentDate.getSeconds().toString().padStart(2, '0');
    var currentTimeString = `${hours}${minutes}${seconds}`;
  
    var current_date = year + "." + month + "." + day + "." + currentTimeString + "." + index.toString();

    // Append the current date in the specified format
    parts.push(current_date);

    var updatedName = parts.join(' - ');

    return updatedName;
  }

}
