-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `source` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `timeZone` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdSets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,
    `facebook_id` VARCHAR(191) NOT NULL,
    `adaccount_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `daily_budget` VARCHAR(191) NOT NULL,
    `created_time` VARCHAR(191) NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DmReportingHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `advertiser` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `manager` VARCHAR(191) NULL,
    `buyer` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `hour` INTEGER NOT NULL,
    `campaign` VARCHAR(191) NOT NULL,
    `adset` VARCHAR(191) NULL,
    `adsetid` INTEGER NULL,
    `revenue` DOUBLE NOT NULL,
    `spend` DOUBLE NOT NULL,
    `link_clicks` INTEGER NOT NULL,
    `ad_clicks` INTEGER NOT NULL,
    `gp` DOUBLE NOT NULL,
    `searches` INTEGER NOT NULL,
    `clicks` INTEGER NOT NULL,
    `tq` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DmReporting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `advertiser` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `manager` VARCHAR(191) NULL,
    `buyer` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `hour` INTEGER NOT NULL,
    `campaign` VARCHAR(191) NOT NULL,
    `adset` VARCHAR(191) NULL,
    `adsetid` INTEGER NULL,
    `revenue` DOUBLE NOT NULL,
    `spend` DOUBLE NOT NULL,
    `link_clicks` INTEGER NOT NULL,
    `ad_clicks` INTEGER NOT NULL,
    `gp` DOUBLE NOT NULL,
    `searches` INTEGER NOT NULL,
    `clicks` INTEGER NOT NULL,
    `tq` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdSetsHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,
    `facebook_id` VARCHAR(191) NOT NULL,
    `adaccount_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `daily_budget` VARCHAR(191) NOT NULL,
    `created_time` VARCHAR(191) NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
