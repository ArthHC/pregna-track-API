/*
  Warnings:

  - You are about to drop the column `surname` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Doctor" ALTER COLUMN "surname" DROP NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(320);

-- AlterTable
ALTER TABLE "public"."Notification" ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Patient" DROP COLUMN "surname",
ADD COLUMN     "babyName" VARCHAR(255),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "public"."Doctor"("email");
