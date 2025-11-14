/*
  Warnings:

  - You are about to drop the column `word` on the `Attempt` table. All the data in the column will be lost.
  - Added the required column `username` to the `Attempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wordID` to the `Attempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attempt" DROP COLUMN "word",
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "wordID" INTEGER NOT NULL;
