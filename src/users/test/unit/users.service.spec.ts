import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../users/users.service';
import { UsersModule } from '../../../users/users.module';

describe('Users Service', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
