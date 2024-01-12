/*
  Warnings:

  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_post_id_fkey";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "question" TEXT;

-- DropTable
DROP TABLE "questions";
