import { Test, TestingModule } from '@nestjs/testing';
import { AdAccountsController } from './ad_accounts.controller';

describe('AdAccountsController', () => {
  let controller: AdAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdAccountsController],
    }).compile();

    controller = module.get<AdAccountsController>(AdAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
