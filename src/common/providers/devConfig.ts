import { Injectable } from '@nestjs/common';

/**
 * The Service class is responsible for fetching the dev config
 * environment variables in the application
 */
@Injectable()
export class DevConfigService {
  /**
   * The private object holding the dev config env variables
   */
  private readonly config: { DBHOST: string };

  /**
   * The constructor function is responsible for setting the default
   * value for the DBHOST config env variable
   */
  constructor() {
    this.config = {
      DBHOST: process.env.DBHOST || 'localhost',
    };
  }

  /**
   * The getDBHOST function is responsible for fetching the DBHOST
   * config env variable
   *
   * @returns {string} DBHOST config env variable
   */
  getDBHOST(): string {
    return this.config.DBHOST;
  }
}
