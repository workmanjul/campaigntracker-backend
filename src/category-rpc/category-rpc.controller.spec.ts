import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRpcController } from './category-rpc.controller';

describe('CategoryRpcController', () => {
  let controller: CategoryRpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryRpcController],
    }).compile();

    controller = module.get<CategoryRpcController>(CategoryRpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
