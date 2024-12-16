import { Module } from '@nestjs/common';
import { CategoryRpcController } from './category-rpc.controller';
import { CategoryRpcService } from './category-rpc.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { PaginationModule } from 'src/pagination/pagination.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CategoryRpcController],
  providers: [CategoryRpcService, PaginationService],
  exports: [CategoryRpcService],
  imports: [PaginationModule, PrismaModule],
})
export class CategoryRpcModule {}
