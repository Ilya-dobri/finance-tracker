/*
  Warnings:

  - A unique constraint covering the columns `[userId,provider,last4]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dedupeHash]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dedupeHash` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_categoryId_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "displayExpiry" TEXT,
ADD COLUMN     "displayNumber" TEXT,
ADD COLUMN     "last4" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dedupeHash" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_provider_last4_key" ON "Account"("userId", "provider", "last4");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_dedupeHash_key" ON "Transaction"("dedupeHash");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
