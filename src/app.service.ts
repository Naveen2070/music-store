import { Inject, Injectable } from '@nestjs/common';
import { DevConfigService } from './common/providers/devConfig';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private devConfigService: DevConfigService,
    @Inject('CONFIG')
    private config: { port: string },
    private configService: ConfigService,
  ) {}
  getHello(): string {
    return `Hello World!, running on ${this.devConfigService.getDBHOST()}:${this.configService.get<number>('port')}`;
  }
}
