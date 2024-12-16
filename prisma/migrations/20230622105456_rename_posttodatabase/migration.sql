/*
  Warnings:

  - You are about to drop the column `post_to_database` on the `Automation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Automation` DROP COLUMN `post_to_database`,
    ADD COLUMN `postToDatabase` BOOLEAN NOT NULL DEFAULT true;
