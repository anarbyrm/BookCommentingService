import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1748709029361 implements MigrationInterface {
    name = 'InitialMigration1748709029361';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "book" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "author" varchar NOT NULL, CONSTRAINT "UQ_c10a44a29ef231062f22b1b7ac5" UNIQUE ("title"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "review" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "comment" varchar, "rating" integer NOT NULL, "bookId" integer)`,
        );
        await queryRunner.query(
            `CREATE TABLE "temporary_review" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "comment" varchar, "rating" integer NOT NULL, "bookId" integer, CONSTRAINT "FK_ae1ec2fd91f77b5df325d1c7b4a" FOREIGN KEY ("bookId") REFERENCES "book" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
        );
        await queryRunner.query(
            `INSERT INTO "temporary_review"("id", "comment", "rating", "bookId") SELECT "id", "comment", "rating", "bookId" FROM "review"`,
        );
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(
            `ALTER TABLE "temporary_review" RENAME TO "review"`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "review" RENAME TO "temporary_review"`,
        );
        await queryRunner.query(
            `CREATE TABLE "review" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "comment" varchar, "rating" integer NOT NULL, "bookId" integer)`,
        );
        await queryRunner.query(
            `INSERT INTO "review"("id", "comment", "rating", "bookId") SELECT "id", "comment", "rating", "bookId" FROM "temporary_review"`,
        );
        await queryRunner.query(`DROP TABLE "temporary_review"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "book"`);
    }
}
