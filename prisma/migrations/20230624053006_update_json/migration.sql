/*
  Warnings:

  - You are about to alter the column `rules` on the `Automation` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- AlterTable
ALTER TABLE `Automation` MODIFY `rules` JSON NULL;
