/*
  Warnings:

  - Added the required column `lastRun` to the `Automation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextRun` to the `Automation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Automation` ADD COLUMN `lastRun` DATETIME(3) NOT NULL,
    ADD COLUMN `nextRun` DATETIME(3) NOT NULL;
