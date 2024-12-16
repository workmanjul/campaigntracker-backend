/*
  Warnings:

  - Added the required column `remarks` to the `ManualLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ManualLog` ADD COLUMN `remarks` VARCHAR(191) NOT NULL;
