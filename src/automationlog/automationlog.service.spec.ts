import { Test, TestingModule } from '@nestjs/testing';
import { AutomationlogService } from './automationlog.service';

describe('AutomationlogService', () => {
  let service: AutomationlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutomationlogService],
    }).compile();

    service = module.get<AutomationlogService>(AutomationlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
