import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Automation, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAutomationDto } from './dto/CreateAutomation.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { Logger } from '@nestjs/common';
import { AutomationlogService } from 'src/automationlog/automationlog.service';
import { error } from 'console';
import axios, { AxiosResponse } from 'axios';
import { FACEBOOK_ACCESS_TOKEN, FACEBOOK_API_URL } from 'src/config';

interface Rule {
  id: number;
  days?: string;
  type: string;
  param: string;
  daysAgo: string;
  adset_name: string;
  operand: string;
  averageRPC: string;
  parameters: string;
  categoryRPC: string;
  display_text: string;
  dollarValue: string;
  percentValue: string;
  daysCompareTo: string;
  valuesAdclicks: string;
  daysOfTimeFrame: string;
  budgetAdjustment: string;
  percentageOfTimeFrame: string;
}

interface JoinList {
  [alias: string]: string;
}

interface WithList {
  [alias: string]: string;
}

interface QueryResponse {
  adset_id: string;
  daily_budget: number;
  status: string;
}

@Injectable()
export class AutomationService {
  constructor(
    private prisma: PrismaService,
    private readonly paginationService: PaginationService<Automation>,
    @Inject(AutomationlogService)
    private readonly automationLogService: AutomationlogService,
    private readonly logger: Logger,
  ) {}

  async storeAutomation(createAutomationDto: CreateAutomationDto) {
    const formattedRowsPromises = createAutomationDto.data.map((data) => {
      return this.formatData(data);
    });
    const formattedRows = await Promise.all(formattedRowsPromises);

    // Create a new Date object representing the current date and time
    const currentDate = new Date();

    // Add 10 minutes to the current date
    currentDate.setMinutes(
      currentDate.getMinutes() +
        parseInt(createAutomationDto.automationInMinutes),
      parseInt(createAutomationDto.automationInMinutes),
    );
    // Retrieve the updated date and time
    const updatedDate = currentDate;
    const displayTextOverall = this.createAutomationDisplayText(formattedRows);
    const automationData = await this.prisma.automation.create({
      data: {
        rules: formattedRows,
        name: createAutomationDto.name,
        automationInMinutes: createAutomationDto.automationInMinutes,
        budgetType: createAutomationDto.budgetType,
        options: createAutomationDto.options,
        status: createAutomationDto.status,
        actionStatus: createAutomationDto.actionStatus,
        budgetAmount: createAutomationDto.budgetAmount,
        budgetPercent: createAutomationDto.budgetPercent,
        displayText: displayTextOverall,
        postToDatabase: createAutomationDto.postToDatabase,
        lastRun: createAutomationDto.lastRun,
        nextRun: updatedDate,
        blockAdset: createAutomationDto.blockAdset,
        includeAdset: createAutomationDto.includeAdset,
        numOfDuplicateAdSet: createAutomationDto.numOfDuplicateAdSet,
        duplicateAdSetAmount: createAutomationDto.duplicateAdSetAmount,
        duplicateAdSetName: createAutomationDto.duplicateAdSetName,
      },
    });
    console.log(automationData);
    return automationData;
  }

  // Create display_text
  createAutomationDisplayText(jsonRules: any): string {
    let displayTextOverall = '';
    jsonRules.forEach((rule) => {
      displayTextOverall = displayTextOverall + rule.displayText + '\n';
    });

    return displayTextOverall;
  }

  async formatData(data) {
    let display_text = '';
    if ('param' in data && data['param']) {
      display_text += data.param + ' ';
    }
    if ('daysAgo' in data && data['daysAgo']) {
      display_text += data.daysAgo + ' days ';
    }
    if ('operand' in data && data['operand']) {
      display_text += data.operand + ' ';
    }
    if ('daysValue' in data && data['daysValue']) {
      display_text += data.daysValue + ' days ';
    }

    if ('dollarValue' in data && data['dollarValue']) {
      display_text += data.dollarValue + ' ';
    }
    if ('daysCompareTo' in data && data['daysCompareTo']) {
      display_text += data.daysCompareTo + ' days ago ';
    }
    if ('percentValue' in data && data['percentValue']) {
      display_text += data.percentValue + '%';
    }
    if ('valuesAdclicks' in data && data['valuesAdclicks']) {
      display_text += data.valuesAdclicks + ' ';
    }
    if ('budgetAdjustment' in data && data['budgetAdjustment']) {
      display_text += data.budgetAdjustment + ' ';
    }
    if ('averageRPC' in data && data['averageRPC']) {
      display_text += data.averageRPC + ' ';
    }
    if ('categoryRPC' in data && data['categoryRPC']) {
      display_text += data.categoryRPC + ' ';
    }
    if ('parameters' in data && data['parameters']) {
      display_text += data.parameters + ' ';
    }
    if ('percentageOfTimeFrame' in data && data['percentageOfTimeFrame']) {
      display_text += data.percentageOfTimeFrame + '% of ';
    }
    if ('daysOfTimeFrame' in data && data['daysOfTimeFrame']) {
      display_text += data.daysOfTimeFrame + ' days ago ';
    }
    if ('adset_name' in data && data['adset_name']) {
      display_text += data.adset_name + ' ';
    }
    return { ...data, displayText: display_text };
  }

  async getAllAutomations(
    page = 1,
    pageSize = 10,
    filterName = ''
  ): Promise<PaginationResponse<Automation>> {
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);
    console.log(`FILTER: ${filterName}`);
    const automations = await this.prisma.automation.findMany({
      skip: skip,
      take: take,
      where: {
        name: {
          contains: filterName
        }
      }
    });
    const formattedAutomations = automations.map((automation) => {
      return {
        id: automation.id,
        rules: JSON.parse(JSON.stringify(automation.rules)),
        name: automation.name,
        options: automation.options,
        budgetType: automation.budgetType,
        status: automation.status,
        actionStatus: automation.actionStatus,
        lastRun: automation.lastRun,
        nextRun: automation.nextRun,
        budgetPercent: automation.budgetPercent,
        budgetAmount: automation.budgetAmount,
        displayText: automation.displayText,
        postToDatabase: automation.postToDatabase,
        automationInMinutes: automation.automationInMinutes,
        createdAt: automation.createdAt,
        updatedAt: automation.updatedAt,
        blockAdset: automation.blockAdset,
        includeAdset: automation.includeAdset,
        duplicateAdSetAmount: automation.duplicateAdSetAmount,
        numOfDuplicateAdSet: automation.numOfDuplicateAdSet,
        duplicateAdSetName: automation.duplicateAdSetName,
      };
    });
    const totalItems = await this.prisma.user.count(); // Count total number of items
    return this.paginationService.getPaginationData(
      page,
      pageSize,
      formattedAutomations,
      totalItems,
    );
  }

  async updateData(
    id: number,
    createAutomationDto: CreateAutomationDto,
  ): Promise<{ message: string; data: Automation }> {
    const entityToUpdate = await this.prisma.automation.findUnique({
      where: { id },
    });
    if (!entityToUpdate) {
      throw new HttpException(
        {
          message: 'Automation not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const formattedRowsPromises = createAutomationDto.data.map((data) => {
      return this.formatData(data);
    });

    // Create a new Date object representing the current date and time
    const currentDate = new Date();

    // Add 10 minutes to the current date
    currentDate.setMinutes(
      currentDate.getMinutes() +
        parseInt(createAutomationDto.automationInMinutes),
    );

    // Retrieve the updated date and time
    const updatedDate = currentDate;
    const formattedRows = await Promise.all(formattedRowsPromises);
    const jsonRules = JSON.parse(JSON.stringify(formattedRows));
    const displayTextOverall = this.createAutomationDisplayText(formattedRows);
    const automation = await this.prisma.automation.update({
      where: { id },
      data: {
        rules: jsonRules,
        name: createAutomationDto.name,
        automationInMinutes: createAutomationDto.automationInMinutes,
        budgetType: createAutomationDto.budgetType,
        options: createAutomationDto.options,
        status: createAutomationDto.status,
        actionStatus: createAutomationDto.actionStatus,
        budgetAmount: createAutomationDto.budgetAmount,
        budgetPercent: createAutomationDto.budgetPercent,
        displayText: displayTextOverall,
        postToDatabase: createAutomationDto.postToDatabase,
        lastRun: createAutomationDto.lastRun,
        nextRun: updatedDate,
        blockAdset: createAutomationDto.blockAdset,
        includeAdset: createAutomationDto.includeAdset,
        duplicateAdSetAmount: createAutomationDto.duplicateAdSetAmount,
        duplicateAdSetName: createAutomationDto.duplicateAdSetName,
        numOfDuplicateAdSet: createAutomationDto.numOfDuplicateAdSet,
      },
    });
    // this.logger.log(`\n\n------- automation for edit:: ${automation} -------\n\n`);
    return {
      message: 'Automation updated successfully',
      data: automation,
    };
  }

  async deleteData(id: number): Promise<{ message: string }> {
    const entityToDelete = await this.prisma.automation.findUnique({
      where: { id },
    });
    if (!entityToDelete) {
      throw new HttpException(
        {
          message: 'Input Request',
          errors: { email: 'Automation not found' },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.automation.delete({ where: { id } });
    return {
      message: 'Automation deleted successfully',
    };
  }

  async findAutomation(id: number): Promise<Automation | null> {
    return await this.prisma.automation.findUnique({ where: { id } });
  }

  //Run Automation
  async runAutomation(): Promise<boolean> {
    this.logger.log('Started Cron Job for RunAutomation');
    try {
      const automations = await this.prisma.automation.findMany({
        where: {
          status: 'active',
        },
      });

      const results: boolean[] = [];
      if (automations.length <= 0) {
        this.logger.log('No Rules Matched. Automation will not run..');
      }

      for (let i = 0; i < automations.length; i++) {
        const automation = automations[i];
        const { automationInMinutes } = automation;
        const rules = JSON.parse(JSON.stringify(automation.rules));
        const adsetTable = 'AdSets';
        const reportView = 'v_spendreport';
        const blockAdset = automation.blockAdset;
        const includeAdset = automation.includeAdset;
        const automationId = automation.id;

        // For each row, generateQuery.
        const query = await this.generateQuery(
          rules,
          adsetTable,
          reportView,
          blockAdset,
          includeAdset,
          automationId,
        );
        this.logger.log('Query', query);
        if (query) {
          let res: QueryResponse[] = [];
          try {
            // Execute the Query.
            res = await this.prisma.$queryRaw(Prisma.sql([query]));
          } catch (e) {
            this.logger.error(e.toString());
            continue;
          }

          if (Array.isArray(res) && res.length > 0) {
            //1. Next Action

            //3. API call
            res.map(async (row) => {
              // Execute API Call
              const resQuery = `SELECT daily_budget FROM ${reportView} WHERE adset_id = '${row.adset_id}' LIMIT 1`;
              const response = await this.prisma.$queryRaw(
                Prisma.sql([resQuery]),
              );

              let newBudget: number = null;
              const dailyBudget: number = response[0].daily_budget;

              if (automation.options == 'Budget Increase') {
                if (automation.budgetType == 'percentage') {
                  const budgetPercent = Number(automation.budgetPercent);
                  //newBudget = current + current*budgetPercent
                  if (!Number.isNaN(budgetPercent)) {
                    newBudget =
                      dailyBudget +
                      dailyBudget * (Number(automation.budgetPercent) / 100);
                  } else {
                    this.logger.error(error);
                  }
                } else {
                  newBudget = Number(automation.budgetAmount) * 100;
                }
              } else {
                if (automation.budgetType == 'percentage') {
                  //newBudget = current - current*budgetPercent
                  const budgetPercent = Number(automation.budgetPercent);
                  if (!Number.isNaN(budgetPercent)) {
                    newBudget =
                      dailyBudget -
                      dailyBudget * (Number(automation.budgetPercent) / 100);
                  } else {
                    this.logger.error(error);
                  }
                } else {
                  newBudget = Number(automation.budgetAmount) * 100;
                }
              }

              //1. Post to database Only
              let data;
              this.logger.log('Execute API CAll, Post into database..');
              let actionDisplayText = '';
              let action = '';
              if (automation.options === 'Status') {
                actionDisplayText =
                  automation.options + ' =>  ' + automation.actionStatus;
              } else if (automation.budgetType === 'percentage') {
                actionDisplayText =
                  automation.options +
                  ' =>  ' +
                  automation.budgetPercent +
                  ' %' +
                  ' New Budget => ' +
                  newBudget;
              } else if (automation.options == 'DuplicateAdsSet') {
                actionDisplayText =
                  automation.options +
                  ':' +
                  'Duplicate AdSets =>  ' +
                  automation.numOfDuplicateAdSet +
                  '\n with AdSet Budget =>' +
                  automation.duplicateAdSetAmount;
              } else if (automation.budgetType === 'amount') {
                actionDisplayText =
                  automation.options +
                  ' =>  ' +
                  automation.budgetAmount +
                  ' %' +
                  'New Budget =>' +
                  newBudget;
              }
              newBudget = Math.ceil(newBudget);

              if (automation.options === 'Status') {
                action = 'Status Adjusted';
              }
              if (
                automation.options === 'Budget Increase' ||
                automation.options === 'Budget Decrease'
              ) {
                action = 'Budget Adjusted';
                const currentTime = new Date();
                await this.prisma.budgetAdjustment.update({
                  where: { adset_id: row.adset_id },
                  data: { last_budget_adjustment: currentTime },
                });
              }

              data = {
                automationId: automation.id,
                actionDisplayText: actionDisplayText,
                rulesDisplay: automation.displayText,
                adSetId: row.adset_id,
                action: action,
                query: query,
                previous_value: {
                  budget: row.daily_budget.toString(),
                  status: automation.status.toUpperCase(),
                },
                new_value: {
                  budget: newBudget,
                  status: automation.status.toUpperCase(),
                },
              };

              // API Calls to Facebook
              if (!automation.postToDatabase) {
                const adSetData = row.adset_id;
                const adSetID = row.adset_id;

                if (
                  automation.options == 'DuplicateAdsSet' &&
                  automation.numOfDuplicateAdSet &&
                  automation.duplicateAdSetAmount
                ) {
                  await this.handleDupicateAdSets(
                    adSetID,
                    automation.numOfDuplicateAdSet,
                    automation.duplicateAdSetAmount,
                  );
                } else {
                  try {
                    const apiResponse = await this.getAdsetCurrentData(
                      adSetData,
                    );
                    data.previous_value.budget = apiResponse['daily_budget'];
                    data.previous_value.status = apiResponse['status'];
                    
                    let newStatus = '';
                    if (automation.options === 'Status') {
                      newStatus = automation.actionStatus;
                    } else {
                      newStatus = apiResponse['status'];
                    }
                    await this.automationLogService.createAutomationLog(data);
                    
                    await this.postAdsetNewData(
                      adSetID,
                      newBudget,
                      newStatus.toUpperCase(),
                    );
                  } catch (error) {
                    this.logger.error('Error in API Call');
                  }
                }
              } else {
                await this.automationLogService.createAutomationLog(data);
              }
            });
          }
        }

        // Create a new Date object representing the current date and time
        const currentDate = new Date();

        // Add automation Minutes to the current date
        currentDate.setMinutes(
          currentDate.getMinutes() + parseInt(automationInMinutes),
        );

        // 4. Update NextRun, Update LastRun
        const updateAutomation = await this.prisma.automation.update({
          where: { id: automation.id },
          data: {
            lastRun: new Date(),
          },
        });
      }

      this.logger.log('End Cron Job for Run Automation');
      return results.includes(false) ? false : true;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async handleDupicateAdSets(
    adsetId: String,
    duplicateCount: String,
    duplicateAmount: String,
  ): Promise<boolean> {
    let status = false;
    const duplicateAdSetCount = Number(duplicateCount);

    const apiResponse = await this.getAdsetCurrentData(adsetId);
    const adsetName = apiResponse['name'];

    for (var i = 0; i < Number(duplicateAdSetCount); i++) {
      // 1.1 Generate Name
      const newAdsetName = await this.generateAdSetNames(adsetName, i);
      // 1.2 Make a copy using copies endpoint
      try {
        const url = `${FACEBOOK_API_URL}${adsetId}/copies?access_token=${FACEBOOK_ACCESS_TOKEN}`;
        this.logger.warn(`URL: ${url}`);
        // 1.3 Store the returning adset_id of the copy
        const response: AxiosResponse = await axios.post(url);
        const copied_adset_id = response.data.copied_adset_id;
        // new_adset_ids.push(copied_adset_id);
        this.logger.log(
          `From ${adsetId} a Duplicate adset ${copied_adset_id} is created.`,
        );

        // 1.4 Update the name of the new adset_id
        let body = {
          name: newAdsetName,
          daily_budget: Number(duplicateAmount),
          status: 'ACTIVE',
        };
        const update_url = `${FACEBOOK_API_URL}${copied_adset_id}?access_token=${FACEBOOK_ACCESS_TOKEN}`;
        this.logger.log(
          `Attempting update of new adsetid ${copied_adset_id} with body: ${JSON.stringify(body)} for URL: ${update_url} `
        )
        const update_response: AxiosResponse = await axios.post(
          update_url,
          body,
        );
        status = true;
      } catch (error) {
        var remarks = error.message;
        this.logger.error(error.message);
        this.logger.error(error.stack);
      }
    }
    return status;
  }
  // 1.1 Generate Name
  // 1.2 Make a copy using copies endpoint
  // 1.3 Store the returning adset_id of the copy
  // 1.4 Update the name of the new adset_id
  // 1.5 Update the entry in automation log
  async getAdsetCurrentData(adsetId: any): Promise<void> {
    const url = `${FACEBOOK_API_URL}${adsetId}?access_token=${FACEBOOK_ACCESS_TOKEN}&fields=id,name,status,daily_budget`;
    try {
      const response: AxiosResponse = await axios.get(url);
      return response.data;
    } catch (error) {
      this.logger.error('Error');
    }
  }
  // ======================================================
  async postAdsetNewData(
    adsetId: any,
    newBudget: number,
    status: string,
  ): Promise<void> {
    let body = {};
    this.logger.log(status, newBudget);

    let newStatus = '';
    if (status === 'START' || status === 'ACTIVE') {
      newStatus = 'ACTIVE';
    } else {
      newStatus = 'PAUSED';
    }
    body = { daily_budget: newBudget.toString(), status: newStatus };
    this.logger.log(
      `Adset ${adsetId} status to be updated to ${JSON.stringify(body)}`,
    );
    const url = `${FACEBOOK_API_URL}${adsetId}?access_token=${FACEBOOK_ACCESS_TOKEN}&fields=id,name,status,daily_budget`;
    try {
      const response: AxiosResponse = await axios.post(url, body);
      this.logger.log(
        `Adset ${adsetId} status updated to ${JSON.stringify(body)}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(error.stack);
    }
  }

  // Service for Query Builder based on automation rules
  async generateQuery(
    rules: Rule[],
    adsetTable: string,
    reportView: string,
    blockAdset: string,
    includeAdset: string,
    automationId: number,
  ): Promise<string> {
    const [whereList, joinList, withList] = this.buildQueryPartials(
      rules,
      reportView,
      blockAdset,
      includeAdset,
      automationId,
    );

    let query = '';
    if (Object.keys(withList).length > 0) {
      query = 'WITH\n';

      const withEntries = Object.values(withList);
      for (let i = 0; i < withEntries.length; i++) {
        query += withEntries[i];
        if (i !== withEntries.length - 1) {
          query += ',';
        }
        query += '\n';
      }
    }

    const select = `SELECT distinct(t1.adset_id), t1.daily_budget FROM ${adsetTable} t1\n`;
    query += select;

    const joinEntries = Object.values(joinList);
    for (const entry of joinEntries) {
      query += entry;
    }

    let whereClause = 'WHERE\n';
    for (let i = 0; i < whereList.length; i++) {
      if (i === 0) {
        whereClause += whereList[i] + '\n';
      } else {
        whereClause += 'AND ' + whereList[i] + '\n';
      }
    }

    query += whereClause + ';';
    return query.toString();
  }

  buildQueryPartials(
    rules: Rule[],
    reportView: string,
    blockAdset: string,
    includeAdset: string,
    automationId: number,
  ): [string[], JoinList, WithList] {
    const whereList: string[] = [];
    const joinList: JoinList = {};
    const withList: WithList = {};

    for (const rule of rules) {
      const param = rule.param;

      if (param === 'current_budget') {
        const operand = rule.operand;
        const value = Number(rule.dollarValue) * 100;
        const condition = `t1.daily_budget`;
        whereList.push(this.generateWhere(condition, operand, value));
      } else if (param === 'adset_age') {
        const operand = rule.operand;
        const value = rule.daysCompareTo;
        const condition = '(TO_DAYS(NOW()) - TO_DAYS(t1.start_time))';
        whereList.push(this.generateWhere(condition, operand, value));
        // ------------------->>>>>>>>>>>>>>>>><<<<<<<<<<<<<<---------------------
      } else if (param === 'adset_name') {
        // generateWhere
        let operand = rule.operand;
        const condition = `t1.adset_name`;
        operand === 'Contains' ? (operand = 'LIKE') : (operand = 'NOT LIKE');
        const value = `%${rule.adset_name}%`;
        whereList.push(this.generateWhere(condition, operand, value));
        // ------------------->>>>>>>>>>>>>>>>><<<<<<<<<<<<<<---------------------
      } else if (param === 'ad_clicks') {
        // generateWith
        const [alias, withQuery] = this.generateWith(param, reportView);
        withList[alias] = withQuery;

        // generateJoin
        joinList[alias] = this.generateJoin(alias);

        // generateWhere
        const operand = rule.operand;
        const value = rule.valuesAdclicks;
        const condition = `${alias}.total_clicks`;

        whereList.push(this.generateWhere(condition, operand, value));
      } else if (param === 'average_rpc') {

        const types = rule.type;

        // generateWith
        const [alias, withQuery] = this.generateWith(param, reportView);
        withList[alias] = withQuery;

        // generateJoin
        joinList[alias] = this.generateJoin(alias);

        // generateWhere
        const operand = rule.operand;
        const condition = `${alias}.average_rpc`;
        let value = '';
        if (types === 'parameter'){
          value = `${alias}.${rule.parameters}`;
        } else if (types === 'number') {
          value = rule.dollarValue;
        }
        whereList.push(this.generateWhere(condition, operand, value));
      } else if (param === 'category_rpc') {
        // generateWith
        const [alias, withQuery] = this.generateWith(param, reportView);
        withList[alias] = withQuery;

        // generateJoin
        joinList[alias] = this.generateJoin(alias);

        // generateWhere
        const operand = rule.operand;
        const condition = `${alias}.category_rpc`;
        const value = `${alias}.${rule.parameters}`;
        whereList.push(this.generateWhere(condition, operand, value));
      } else if (param === 'margin' || param === 'profit') {
        const operand = rule.operand;
        const types = rule.type;
        const daysAgo = rule.daysAgo;
        const daysCompareTo = rule.daysCompareTo;
        const percentValue = rule.percentValue;
        const dollarValue = rule.dollarValue;
        const daysOfTimeFrame = rule.daysOfTimeFrame;
        const percentageOfTimeFrame = rule.percentageOfTimeFrame;

        const days: string[] = [];
        if (types === 'timeframe') {
          if (daysAgo) days.push(daysAgo);
          if (daysCompareTo) days.push(daysCompareTo);
        } else {
          if (daysAgo) days.push(daysAgo);
        }

        const conditions: string[] = [];
        for (const day of days) {
          const [alias, withQuery] = this.generateWith(param, reportView, day);
          withList[alias] = withQuery;
          joinList[alias] = this.generateJoin(alias);
          if (types === 'number') {
            const condition = `${alias}.${param}`;
            const value = dollarValue;
            whereList.push(this.generateWhere(condition, operand, value));
          } else {
            const condition = `${alias}.${param}`;
            conditions.push(condition);
          }
        }

        if (types === 'percentageOfTimeFrame') {
          const day1 = rule.daysAgo;
          const day2 = rule.daysOfTimeFrame;
          const percentageVal = +percentageOfTimeFrame / 100;
          const [alias1, withQuery1] = this.generateWith(
            param,
            reportView,
            day1,
          );
          const [alias2, withQuery2] = this.generateWith(
            param,
            reportView,
            day2,
          );

          withList[alias1] = withQuery1;
          withList[alias2] = withQuery2;
          joinList[alias1] = this.generateJoin(alias1);
          joinList[alias2] = this.generateJoin(alias2);

          const condition = `${alias1}.${param}`;
          const value = `${percentageVal} * ${alias2}.${param}`;
          const operator = operand;

          whereList.push(this.generateWhere(condition, operator, value));
        }

        if (types === 'timeframe') {
          whereList.push(
            this.generateWhere(conditions[0], operand, conditions[1]),
          );
        }
      } else if (param === 'rpc') {
        const operand = rule.operand;
        const parameters = rule.parameters;
        const daysAgo = rule.daysAgo;
        const daysCompareTo = rule.daysCompareTo;
        const types = rule.type;

        const days: string[] = [];
        if (types === 'timeframe') {
          if (daysAgo) days.push(daysAgo);
          if (daysCompareTo) days.push(daysCompareTo);
        } else {
          if (daysAgo) days.push(daysAgo);
        }

        const conditions: string[] = [];

        for (const day of days) {
          const [alias, withQuery] = this.generateWith(param, reportView, day);
          withList[alias] = withQuery;
          joinList[alias] = this.generateJoin(alias);

          if (types === 'parameter') {
            const conditions = `${alias}.average_rpc`;
            let value = '';

            if (param === 'rpc') {
              value = `${alias}.${parameters}`;
            }
            whereList.push(this.generateWhere(conditions, operand, value));
          } else {
            const condition = `${alias}.${param}`;
            conditions.push(condition);
          }
        }
      }
    }

    //t1.status = 'ACTIVE'
    whereList.push(this.generateWhere('t1.status', '=', `'ACTIVE'`));
    if (blockAdset) {
      whereList.push(
        this.generateWhere('NOT t1.name', 'LIKE', `'%${blockAdset}%'`),
      );
    } else if (includeAdset) {
      whereList.push(
        this.generateWhere('t1.name', 'LIKE', `'%${includeAdset}%'`),
      );
    }
    return [whereList, joinList, withList];
  }

  generateWhere(
    condition: string,
    operand: string,
    value: string | number,
  ): string {
    const query = `${condition} ${operand} ${value}`;
    return query;
  }

  generateWith(
    param: string,
    reportView?: string,
    day?: string,
  ): [string, string] {
    let alias = '';
    let withQuery = '';
    if (param === 'ad_clicks') {
      alias = param;
      withQuery = `\t${alias} AS (SELECT adset_id,sum(clicks) as total_clicks FROM ${reportView} GROUP BY adset_id`;
      withQuery += ')';
    } else if (
      param === 'average_rpc' ||
      param === 'category_rpc' ||
      param === 'rpc'
    ) {
      alias = 'vSpend';
      withQuery = `\t${alias} AS (SELECT adset_id, categoryRPC as category_rpc, averageRPC as average_rpc FROM ${reportView}`;
      withQuery += ')';
    } else {
      alias = param + day;
      withQuery = `\t${alias} AS (SELECT * FROM ${reportView} WHERE reportDate = DATE_SUB(CURDATE(), INTERVAL ${day} DAY)`;
      withQuery += ')';
    }

    return [alias, withQuery];
  }

  generateJoin(alias: string): string {
    const joinQuery = `\tJOIN ${alias} ON t1.adset_id = ${alias}.adset_id\n`;
    return joinQuery;
  }
  async logToDatabase(
    adsetId: string,
    action: string,
    newBudget: number,
    status: string,
    remarks: string,
  ): Promise<void> {
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

  async generateAdSetNames(name: String, increment: number) {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .slice(8, 10)
      .concat(currentDate.toISOString().slice(5, 7))
      .concat(currentDate.toISOString().slice(2, 4));

    let adSetName = '';
    const letter = String.fromCharCode(65 + increment);
    adSetName = `${name}XXDupe${formattedDate}${letter}`;
    this.logger.log(`Adset Name generated: ${adSetName}`);
    return adSetName;
  }
}
