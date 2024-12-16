/*
  Warnings:

  - You are about to drop the column `date` on the `DmReporting` table. All the data in the column will be lost.
  - You are about to drop the column `hour` on the `DmReporting` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `DmReportingHistory` table. All the data in the column will be lost.
  - You are about to drop the column `hour` on the `DmReportingHistory` table. All the data in the column will be lost.
  - Added the required column `start_time` to the `DmReporting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `DmReportingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DmReporting` DROP COLUMN `date`,
    DROP COLUMN `hour`,
    ADD COLUMN `start_time` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `DmReportingHistory` DROP COLUMN `date`,
    DROP COLUMN `hour`,
    ADD COLUMN `start_time` DATETIME(3) NOT NULL;
