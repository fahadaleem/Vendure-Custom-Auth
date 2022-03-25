import {MigrationInterface, QueryRunner} from "typeorm";

export class mymigration1647513733412 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsAdditionalinfo" text`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsSpecs" text`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsWidth" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsHeight" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsDepth" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsWeight" integer`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsWeight"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsDepth"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsHeight"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsWidth"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsSpecs"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsAdditionalinfo"`, undefined);
   }

}
