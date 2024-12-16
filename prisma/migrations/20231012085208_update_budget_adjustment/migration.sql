/*
  Warnings:

  - You are about to alter the column `last_budget_adjustment` on the `BudgetAdjustment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `BudgetAdjustment` MODIFY `last_budget_adjustment` DATETIME(3) NULL;
