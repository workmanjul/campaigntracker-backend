import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
    // Load environment variables from .env file
    config();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
