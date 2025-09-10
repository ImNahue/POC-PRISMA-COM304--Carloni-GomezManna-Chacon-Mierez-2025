/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- AlterTable
ALTER TABLE `category` MODIFY `id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `categoryId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `category_name_key` ON `category`(`name`);

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
