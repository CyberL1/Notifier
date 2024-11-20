/*
  Warnings:

  - Added the required column `type` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "type" TEXT NOT NULL;
