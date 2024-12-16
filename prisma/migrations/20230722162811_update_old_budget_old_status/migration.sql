-- AlterTable
ALTER TABLE `AutomationLog` ADD COLUMN `old_budget` VARCHAR(191) NULL,
    ADD COLUMN `old_status` VARCHAR(191) NULL,
    MODIFY `query` VARCHAR(191) NULL;
