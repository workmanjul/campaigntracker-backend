import { Test, TestingModule } from '@nestjs/testing';
import { AdAccountsService } from './ad_accounts.service';

describe('AdAccountsService', () => {
  let service: AdAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdAccountsService],
    }).compile();

    service = module.get<AdAccountsService>(AdAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
