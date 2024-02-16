import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth.service';
import { AuthModule } from '../../../auth/auth.module';
import { PrismaService } from '../../../prisma_client/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const mockPrismaService = {
  users: {
    findFirst: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60S' },
        }),
      ],
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should throw NotFoundException if user is not found', async () => {
    mockPrismaService.users.findFirst.mockResolvedValue(null);
    await expect(authService.login('testes', '12345678')).rejects.toThrowError(
      'No user found for username: testes',
    );
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const mockUser = { id: 1, password: 'hashedpassword' };
    mockPrismaService.users.findFirst.mockResolvedValue(mockUser);

    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(false));

    await expect(
      authService.login('Anderson', 'wrongpassword'),
    ).rejects.toThrow('Invalid password!');
  });

  it('should return an access token if login is successful', async () => {
    const mockUser = { id: 1, password: 'hashedpassword' };
    mockPrismaService.users.findFirst.mockResolvedValue(mockUser);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));

    const result = await authService.login('Anderson', 'testpassword');

    expect(result.accessToken).toBeDefined();
    expect(result.accessToken).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
    );
  });
});
