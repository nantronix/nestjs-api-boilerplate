import { Test, TestingModule } from '@nestjs/testing';
import { VirtualEmployeeService } from './virtual_employee.service';

describe('VirtualEmployeeService', () => {
  let service: VirtualEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VirtualEmployeeService],
    }).compile();

    service = module.get<VirtualEmployeeService>(VirtualEmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
