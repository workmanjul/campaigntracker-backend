import {
  Body,
  Controller,
  Post,
  Query,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoryRpcService } from './category-rpc.service';
import { CategoryRPCdto } from './dto/Category-RPC.dto';

@Controller('category-rpc')
export class CategoryRpcController {
  constructor(private readonly categoryRPCService: CategoryRpcService) {}
  @Post()
  async storeCategoryRPC(@Body() categoryRCPData: CategoryRPCdto) {
    return this.categoryRPCService.storeCategoryRPC(categoryRCPData);
  }

  @Get()
  async getAllCategoryRCP(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.categoryRPCService.getAllCategoryRPC(page, pageSize);
  }

  @Get(':id')
  async findCategoryRPC(@Param('id') id: string) {
    return this.categoryRPCService.findCategoryRPC(+id);
  }

  @Delete(':id')
  async deleteCategoryRPC(@Param('id') id: string) {
    return this.categoryRPCService.deleteCategoryRPC(+id);
  }

  @Put(':id')
  async updateCategoryRPC(
    @Body() categoryRPCData: CategoryRPCdto,
    @Param('id') id: string,
  ) {
    return this.categoryRPCService.updateCategoryRCP(+id, categoryRPCData);
  }
}
