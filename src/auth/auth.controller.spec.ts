import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LoginUserDto } from './dto/login.dto';
import { LoginResponse } from './interfaces/login-response.interface';
import { NotFoundException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'mocked_token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      const loginDto: LoginUserDto = { email: 'test@example.com', password: 'testpassword' };

      const result: LoginResponse = await controller.login(loginDto);

      expect(result).toEqual({ access_token: 'mocked_token' });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw error if credentials are invalid', async () => {
      mockAuthService.login = jest.fn().mockRejectedValueOnce(new NotFoundException('Invalid credentials'));
      
      const loginDto: LoginUserDto = { email: 'test@example.com', password: 'wrongpassword' }   

      await expect(controller.login(loginDto)).rejects.toThrow(NotFoundException);
    });
  });
});
