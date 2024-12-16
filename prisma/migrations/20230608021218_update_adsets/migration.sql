/*
  Warnings:

  - A unique constraint covering the columns `[adset_id]` on the table `AdSets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `AdSets_adset_id_key` ON `AdSets`(`adset_id`);
