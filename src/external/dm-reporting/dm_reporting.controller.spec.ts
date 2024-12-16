import { Test, TestingModule } from '@nestjs/testing';
import { DMReportingController } from './dm_reporting.controller';

describe('DMReportingController', () => {
  let controller: DMReportingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DMReportingController],
    }).compile();

    controller = module.get<DMReportingController>(DMReportingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
