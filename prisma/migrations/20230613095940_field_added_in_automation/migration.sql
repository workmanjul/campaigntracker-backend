/*
  Warnings:

  - You are about to alter the column `daily_budget` on the `AdSets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `created_time` on the `AdSets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `start_time` on the `AdSets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `daily_budget` on the `AdSetsHistory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `created_time` on the `AdSetsHistory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `start_time` on the `AdSetsHistory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `AdSets` MODIFY `daily_budget` INTEGER NOT NULL,
    MODIFY `created_time` DATETIME(3) NOT NULL,
    MODIFY `start_time` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `AdSetsHistory` MODIFY `daily_budget` INTEGER NOT NULL,
    MODIFY `created_time` DATETIME(3) NOT NULL,
    MODIFY `start_time` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Automation` ADD COLUMN `automationInMinutes` VARCHAR(191) NULL,
    ADD COLUMN `budgetType` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `options` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NULL;
