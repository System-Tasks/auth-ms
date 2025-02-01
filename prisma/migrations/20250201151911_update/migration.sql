/*
  Warnings:

  - You are about to drop the column `name` on the `Team` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'USER';

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "name";
