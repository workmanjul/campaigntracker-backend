import { Test, TestingModule } from '@nestjs/testing';
import { DMReportingService } from './dm_reporting.service';

describe('ExternalAPIService', () => {
  let service: DMReportingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DMReportingService],
    }).compile();

    service = module.get<DMReportingService>(DMReportingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
