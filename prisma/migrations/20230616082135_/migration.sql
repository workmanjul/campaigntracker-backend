-- AlterTable
ALTER TABLE `Automation` ADD COLUMN `budgetAmount` VARCHAR(191) NULL,
    ADD COLUMN `budgetPercent` VARCHAR(191) NULL,
    ADD COLUMN `post_to_database` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `lastRun` DATETIME(3) NULL,
    MODIFY `nextRun` DATETIME(3) NULL;
