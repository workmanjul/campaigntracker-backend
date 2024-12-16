/*
  Warnings:

  - A unique constraint covering the columns `[adset_id]` on the table `BudgetAdjustment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `BudgetAdjustment_adset_id_key` ON `BudgetAdjustment`(`adset_id`);
