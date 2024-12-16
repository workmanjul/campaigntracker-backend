import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PaginationModule } from 'src/pagination/pagination.module';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [UsersService, PaginationService],
  controllers: [UsersController],
  exports: [UsersService],
  imports: [PaginationModule, PrismaModule],
})
export class UsersModule {}
