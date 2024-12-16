import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { AdAccountDto } from './dto/create-adaccounts.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { AdAccount, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdAccountsService {
  constructor(
    private readonly paginationService: PaginationService<AdAccount>,
    private prisma: PrismaService,
  ) {}
  // CREATE (POST) - Create a new Ad Accounts
  // Parameters:UserData: (source,accountID,name,timeZone,status) in Object Form
  async create(
    dto: AdAccountDto,
  ): Promise<{ message: string; data: AdAccount }> {
    const { accountId, source, name, status, timeZone } = dto;

    const exists = await this.prisma.adAccount.findFirst({
      where: { accountId },
    });
    if (exists) {
      throw new HttpException(
        {
          message: 'Ad Account already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    const ad_account = await this.prisma.adAccount.create({
      data: {
        // TODO: Fix this from frontend/backend
        source: 'facebooks',
        accountId: accountId,
        name: name,
        timeZone: timeZone,
        status: status,
      },
    });
    return {
      message: 'Ad account created successfully',
      data: ad_account,
    };
  }

  // Retrieve all AdAccounts
  async findAllAdAccounts(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginationResponse<AdAccount>> {
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);

    const adAccounts = await this.prisma.adAccount.findMany({
      skip,
      take,
    });

    const totalItems = await this.prisma.user.count(); // Count total number of items

    return this.paginationService.getPaginationData(
      page,
      pageSize,
      adAccounts,
      totalItems,
    );
  }

  async findAllAccounts(): Promise<any> {
    const adAccounts = await this.prisma.adAccount.findMany();
    return adAccounts;
  }

  // READ (GET) - find Ad Accounts by accountID
  // Parameters: id: The accountID of the Ad Accounts
  async findAdAccount(id: number): Promise<AdAccount | null> {
    return await this.prisma.adAccount.findUnique({ where: { id } });
  }

  // DELETE (DELETE) - Delete Ad Accounts by accountId
  // Parameters:
  // - id: The ID of the Ad Accounts to delete

  async deleteAdAccount(id: number): Promise<{ message: string }> {
    const entityToDelete = await this.prisma.adAccount.findUnique({
      where: { id },
    });
    if (!entityToDelete) {
      throw new HttpException(
        {
          message: 'Input Request',
          errors: { email: 'Add Account not found' },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const adAccount = await this.prisma.adAccount.delete({ where: { id } });
    return {
      message: 'Ad account deleted successfully',
    };
  }

  // UPDATE (PUT) - Update Adaccounts details by accountsId
  // Parameters:
  // - id: The ID of the AdAcounts to update
  // - updatedAdaccountData: An object containing the updated user data

  async updateAdAccount(
    id: number,
    adAccountData: AdAccountDto,
  ): Promise<{ message: string; data: AdAccount }> {
    const entityToUpdate = await this.prisma.adAccount.findUnique({
      where: { id },
    });
    if (!entityToUpdate) {
      throw new HttpException(
        {
          message: 'Ad Account not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const adAccount = await this.prisma.adAccount.update({
      where: { id },
      data: adAccountData,
    });
    return {
      message: 'Ad account Updated successfully',
      data: adAccount,
    };
  }
}
