-- AlterTable
ALTER TABLE `DmReporting` ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `market` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `DmReportingHistory` ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `market` VARCHAR(191) NULL;
