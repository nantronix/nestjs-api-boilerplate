import { Test, TestingModule } from '@nestjs/testing';
import { VirtualEmployeeController } from './virtual_employee.controller';
import { VirtualEmployeeService } from './virtual_employee.service';

describe('VirtualEmployeeController', () => {
  let controller: VirtualEmployeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VirtualEmployeeController],
      providers: [VirtualEmployeeService],
    }).compile();

    controller = module.get<VirtualEmployeeController>(VirtualEmployeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
