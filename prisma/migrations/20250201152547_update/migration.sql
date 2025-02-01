/*
  Warnings:

  - You are about to drop the `UserTeam` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[teamId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserTeam" DROP CONSTRAINT "UserTeam_teamId_fkey";

-- DropForeignKey
ALTER TABLE "UserTeam" DROP CONSTRAINT "UserTeam_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "teamId" TEXT;

-- DropTable
DROP TABLE "UserTeam";

-- CreateIndex
CREATE UNIQUE INDEX "User_teamId_key" ON "User"("teamId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
