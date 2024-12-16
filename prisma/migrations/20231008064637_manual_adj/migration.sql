-- CreateTable
CREATE TABLE `ManualLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adset_id` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `new_budget` DOUBLE NOT NULL,
    `created_time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
