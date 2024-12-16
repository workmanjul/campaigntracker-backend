import { Logger, Module } from '@nestjs/common';
import { ManualAdjController } from './manual-adj.controller';
import { ManualAdjService } from './manual-adj.service';
import { PaginationModule } from 'src/pagination/pagination.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ManualAdjController],
  providers: [ManualAdjService,Logger],
  exports:[ManualAdjService],
  imports:[PaginationModule,PrismaModule]
})
export class ManualAdjModule {}
