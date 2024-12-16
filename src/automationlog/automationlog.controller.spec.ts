import { Test, TestingModule } from '@nestjs/testing';
import { AutomationlogController } from './automationlog.controller';

describe('AutomationlogController', () => {
  let controller: AutomationlogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutomationlogController],
    }).compile();

    controller = module.get<AutomationlogController>(AutomationlogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
