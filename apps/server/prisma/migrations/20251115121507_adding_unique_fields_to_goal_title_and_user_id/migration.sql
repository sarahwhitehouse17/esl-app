/*
  Warnings:

  - A unique constraint covering the columns `[goalTitle,userId]` on the table `Goal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Goal_goalTitle_userId_key" ON "Goal"("goalTitle", "userId");
