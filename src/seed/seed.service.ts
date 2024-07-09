import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seedData } from './seeds/data.seed';

@Injectable()
export class SeedService {
  constructor(private readonly connection: DataSource) {}

  async seed(): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    console.log('Query runner connected.');
    await queryRunner.connect();
    console.log('Transaction Started.');
    await queryRunner.startTransaction();

    try {
      console.log('Starting database seeding...');
      const manager = queryRunner.manager;
      await seedData(manager);
      console.log('Database seeding completed.');

      await queryRunner.commitTransaction();
      console.log('Transaction committed successfully.');
    } catch (err) {
      console.log('Error during database seeding:', err);
      await queryRunner.rollbackTransaction();
      console.log('Transaction rolled back.');
    } finally {
      await queryRunner.release();
      console.log('Query runner released.');
    }
  }

  async purge(): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    console.log('Query runner connected.');
    await queryRunner.connect();
    console.log('Transaction Started.');
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      console.log('Starting database purging...');
      const tables = ['users', 'artists', 'playlists', 'songs'];

      for (const table of tables) {
        console.log(`Purging table ${table}...`);
        await manager.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
      }
      console.log('Purge completed successfully.');
      await queryRunner.commitTransaction();

      console.log('Transaction committed successfully.');
    } catch (err) {
      console.log('Error during database purging:', err);
      await queryRunner.rollbackTransaction();
      console.log('Transaction rolled back.');
    } finally {
      await queryRunner.release();
      console.log('Query runner released.');
    }
  }
}
