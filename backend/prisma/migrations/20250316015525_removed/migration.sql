/*
  Warnings:

  - You are about to drop the column `accountVisibility` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "accountVisibility";

-- DropEnum
DROP TYPE "AccountVisibility";
