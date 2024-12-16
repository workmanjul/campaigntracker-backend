/*
  Warnings:

  - You are about to drop the column `campaign` on the `DmReporting` table. All the data in the column will be lost.
  - You are about to drop the column `campaign` on the `DmReportingHistory` table. All the data in the column will be lost.
  - Added the required column `campaignId` to the `DmReporting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaignId` to the `DmReportingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DmReporting` DROP COLUMN `campaign`,
    ADD COLUMN `campaignId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `DmReportingHistory` DROP COLUMN `campaign`,
    ADD COLUMN `campaignId` VARCHAR(191) NOT NULL;
