/*
  Warnings:

  - You are about to alter the column `new_value` on the `AutomationLog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `AutomationLog` MODIFY `new_value` JSON NULL;
