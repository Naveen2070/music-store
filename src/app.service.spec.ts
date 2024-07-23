/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { DevConfigService } from './common/providers/devConfig';
import { ConfigService } from '@nestjs/config';

describe('AppService', () => {
  let appService: AppService;
  let devConfigService: DevConfigService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: DevConfigService,
          useValue: {
            getDBHOST: jest.fn().mockReturnValue('localhost'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'port') {
                return 3000;
              }
              return null;
            }),
          },
        },
        {
          provide: 'CONFIG',
          useValue: { port: '3000' },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    devConfigService = module.get<DevConfigService>(DevConfigService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getHello', () => {
    it('should return a greeting with port and DB host', () => {
      const result = appService.getHello();
      expect(result).toBe('Hello World!, running on localhost:3000');
    });
  });
});
