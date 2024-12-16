/*
  Warnings:

  - You are about to drop the column `old_budget` on the `AutomationLog` table. All the data in the column will be lost.
  - You are about to drop the column `old_status` on the `AutomationLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `AutomationLog` DROP COLUMN `old_budget`,
    DROP COLUMN `old_status`,
    ADD COLUMN `new_value` VARCHAR(191) NULL,
    ADD COLUMN `previous_value` VARCHAR(191) NULL;
