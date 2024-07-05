import { Inject, Injectable } from '@nestjs/common';
import { DevConfigService } from './common/providers/devConfig';

@Injectable()
export class AppService {
  constructor(
    private devConfigService: DevConfigService,
    @Inject('CONFIG')
    private config: { port: string },
  ) {}
  getHello(): string {
    return `Hello World!, running on ${this.devConfigService.getDBHOST()}:${this.config.port}`;
  }
}
