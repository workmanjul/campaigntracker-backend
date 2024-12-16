-- CreateTable
CREATE TABLE `BudgetAdjustment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adset_id` VARCHAR(191) NOT NULL,
    `last_budget_adjustment` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
