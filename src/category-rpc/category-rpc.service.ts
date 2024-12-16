import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationService } from 'src/pagination/pagination.service';
import { CategoryRPC } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryRPCdto } from './dto/Category-RPC.dto';

@Injectable()
export class CategoryRpcService {
  constructor(
    private readonly paginationService: PaginationService<CategoryRPC>,
    private prismaService: PrismaService,
  ) {}

  //CREATE (POST) - Create new category RPC

  async storeCategoryRPC(dto: CategoryRPCdto) {
    const categoryRPCData = await this.prismaService.categoryRPC.create({
      data: {
        category: dto.category,
        country: dto.country,
        RPC: dto.rpc,
      },
    });
    return categoryRPCData;
  }

  //Retrive All Category_RPC

  async getAllCategoryRPC(
    page = 1,
    pageSize = 10,
  ): Promise<PaginationResponse<CategoryRPC>> {
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);
    const categoryRPC = await this.prismaService.categoryRPC.findMany({
      skip,
      take,
    });
    const totalItems = await this.prismaService.user.count();
    return this.paginationService.getPaginationData(
      page,
      pageSize,
      categoryRPC,
      totalItems,
    );
  }

  async findAllCategoryRPC(): Promise<any> {
    const categoryRPC = await this.prismaService.categoryRPC.findMany();
    return categoryRPC;
  }

  //READ (GET) - find CategoryRPC by id

  async findCategoryRPC(id: number): Promise<CategoryRPC | null> {
    return await this.prismaService.categoryRPC.findUnique({ where: { id } });
  }

  async deleteCategoryRPC(id: number): Promise<{ message: string }> {
    const deleteCategoryRPC = await this.prismaService.categoryRPC.findUnique({
      where: { id },
    });
    if (!deleteCategoryRPC) {
      throw new HttpException(
        {
          message: 'Input Request',
          error: { email: 'CategoryRPC not found' },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const categoryRPC = await this.prismaService.categoryRPC.delete({
      where: { id },
    });
    return {
      message: 'CategoryRPC deleted successfully',
    };
  }

  async updateCategoryRCP(
    id: number,
    categoryRCPData: CategoryRPCdto,
  ): Promise<{ message: string; data: CategoryRPC }> {
    const modelToUpdate = await this.prismaService.categoryRPC.findUnique({
      where: { id },
    });
    if (!modelToUpdate) {
      throw new HttpException(
        {
          message: 'CategoryRPC not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const categoryRPC = await this.prismaService.categoryRPC.update({
      where: { id },
      data: categoryRCPData,
    });
    return {
      message: 'CategoryRCP Updated successfully',
      data: categoryRPC,
    };
  }
}
