/*
  Warnings:

  - You are about to drop the column `adsetid` on the `DmReporting` table. All the data in the column will be lost.
  - You are about to drop the column `adsetid` on the `DmReportingHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[start_time,adset_id]` on the table `DmReporting` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `DmReporting` DROP COLUMN `adsetid`,
    ADD COLUMN `adset_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `DmReportingHistory` DROP COLUMN `adsetid`,
    ADD COLUMN `adset_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `DmReporting_start_time_adset_id_key` ON `DmReporting`(`start_time`, `adset_id`);
