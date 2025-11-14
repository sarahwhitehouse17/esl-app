/*
  Warnings:

  - You are about to drop the column `wordId` on the `Attempt` table. All the data in the column will be lost.
  - Added the required column `attemptNum` to the `Attempt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_wordId_fkey";

-- AlterTable
ALTER TABLE "Attempt" DROP COLUMN "wordId",
ADD COLUMN     "attemptNum" INTEGER NOT NULL;
