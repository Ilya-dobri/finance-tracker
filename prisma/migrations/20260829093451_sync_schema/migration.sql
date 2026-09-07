/*
  Warnings:

  - Added the required column `bankAccountId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "bankAccountId" TEXT NOT NULL,
ADD COLUMN     "provider" TEXT NOT NULL;
