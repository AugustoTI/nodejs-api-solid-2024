/*
  Warnings:

  - Added the required column `longitude` to the `gyms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gyms" ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL;
