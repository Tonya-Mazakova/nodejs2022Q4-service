import { MigrationInterface, QueryRunner } from "typeorm";

export class init1676921904037 implements MigrationInterface {
    name = 'init1676921904037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "version" integer NOT NULL, "createdAt" bigint NOT NULL DEFAULT '1676921905227', "updatedAt" bigint NOT NULL DEFAULT '1676921905227', CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "artists_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "grammy" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_9006add2ef8f8c4819e0120798c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "albums_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" integer NOT NULL, "artistId" uuid, CONSTRAINT "PK_9ea9b44faacc387d78b7a9e0de5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tracks_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "albumId" uuid, "artistId" uuid, "duration" integer NOT NULL, CONSTRAINT "UQ_5aefce4d4c3c79f1e3d5cc697ff" UNIQUE ("albumId"), CONSTRAINT "UQ_3cff1111d5945d789250e7558f4" UNIQUE ("artistId"), CONSTRAINT "PK_185255aaeb2998a1bafaceffb84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorites_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "artists" text array NOT NULL, "albums" text array NOT NULL, "tracks" text array NOT NULL, CONSTRAINT "PK_e42953e6be13870839a04a3fa88" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "albums_entity" ADD CONSTRAINT "FK_e685e7eae7908de84b09452b423" FOREIGN KEY ("artistId") REFERENCES "artists_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tracks_entity" ADD CONSTRAINT "FK_5aefce4d4c3c79f1e3d5cc697ff" FOREIGN KEY ("albumId") REFERENCES "albums_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tracks_entity" ADD CONSTRAINT "FK_3cff1111d5945d789250e7558f4" FOREIGN KEY ("artistId") REFERENCES "artists_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks_entity" DROP CONSTRAINT "FK_3cff1111d5945d789250e7558f4"`);
        await queryRunner.query(`ALTER TABLE "tracks_entity" DROP CONSTRAINT "FK_5aefce4d4c3c79f1e3d5cc697ff"`);
        await queryRunner.query(`ALTER TABLE "albums_entity" DROP CONSTRAINT "FK_e685e7eae7908de84b09452b423"`);
        await queryRunner.query(`DROP TABLE "favorites_entity"`);
        await queryRunner.query(`DROP TABLE "tracks_entity"`);
        await queryRunner.query(`DROP TABLE "albums_entity"`);
        await queryRunner.query(`DROP TABLE "artists_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}
