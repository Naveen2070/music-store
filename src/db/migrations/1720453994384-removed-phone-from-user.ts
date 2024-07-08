import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedPhoneFromUser1720453994384 implements MigrationInterface {
  name = 'RemovedPhoneFromUser1720453994384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phone" character varying NOT NULL`,
    );
  }
}
