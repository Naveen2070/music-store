import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/middleware/jwt/jwt-guard';

describe('AppController', () => {
  let appController: AppController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue('Hello World!'),
            getProfile: jest.fn().mockReturnValue('Profile'),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('profile', () => {
    it('should return user profile', () => {
      const mockRequest = { user: 'Profile' };
      const result = appController.getProfile(mockRequest);
      expect(result).toBe('Profile');
    });
  });
});
