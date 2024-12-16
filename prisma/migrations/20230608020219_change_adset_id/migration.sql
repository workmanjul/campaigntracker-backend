/*
  Warnings:

  - You are about to drop the column `facebook_id` on the `AdSetsHistory` table. All the data in the column will be lost.
  - Added the required column `adset_id` to the `AdSetsHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AdSetsHistory` DROP COLUMN `facebook_id`,
    ADD COLUMN `adset_id` VARCHAR(191) NOT NULL;
