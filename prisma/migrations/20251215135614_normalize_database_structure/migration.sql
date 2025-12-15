/*
  Warnings:

  - You are about to drop the column `EDD` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `assistanceDaysAfterEDD` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `assistanceDaysBeforeEDD` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `babyBirthDate` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `babyName` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `observation` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `parity` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `pregnancyStatus` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `doctor_id` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Patient" DROP CONSTRAINT "Patient_doctorId_fkey";

-- AlterTable
ALTER TABLE "public"."Patient" DROP COLUMN "EDD",
DROP COLUMN "assistanceDaysAfterEDD",
DROP COLUMN "assistanceDaysBeforeEDD",
DROP COLUMN "babyBirthDate",
DROP COLUMN "babyName",
DROP COLUMN "color",
DROP COLUMN "dateOfBirth",
DROP COLUMN "doctorId",
DROP COLUMN "observation",
DROP COLUMN "parity",
DROP COLUMN "phoneNumber",
DROP COLUMN "pregnancyStatus",
ADD COLUMN     "badge_color" VARCHAR(7),
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "doctor_id" INTEGER NOT NULL,
ADD COLUMN     "phone_number" VARCHAR(20);

-- CreateTable
CREATE TABLE "public"."Pregnancy" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "baby_name" VARCHAR(255),
    "edd" TIMESTAMP(3) NOT NULL,
    "status" TEXT DEFAULT 'Em acompanhamento',
    "assistance_days_before_edd" INTEGER NOT NULL,
    "assistance_days_after_edd" INTEGER NOT NULL,
    "baby_birth_date" TIMESTAMP(3),
    "observation" TEXT,

    CONSTRAINT "Pregnancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Parity" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "gestations" INTEGER NOT NULL,
    "births_vaginal" INTEGER NOT NULL,
    "births_cesarean" INTEGER NOT NULL,
    "abortions" INTEGER NOT NULL,

    CONSTRAINT "Parity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Patient" ADD CONSTRAINT "Patient_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pregnancy" ADD CONSTRAINT "Pregnancy_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parity" ADD CONSTRAINT "Parity_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
