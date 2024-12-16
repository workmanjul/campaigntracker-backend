import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRpcService } from './category-rpc.service';

describe('CategoryRpcService', () => {
  let service: CategoryRpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryRpcService],
    }).compile();

    service = module.get<CategoryRpcService>(CategoryRpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
