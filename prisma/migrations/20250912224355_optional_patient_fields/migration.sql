-- CreateTable
CREATE TABLE "public"."Doctor" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "surname" VARCHAR(255) NOT NULL,
    "email" CHAR(320) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Patient" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "surname" VARCHAR(255),
    "dateOfBirth" DATE,
    "color" VARCHAR(6),
    "EDD" DATE NOT NULL,
    "assistanceDaysBeforeEDD" INTEGER NOT NULL,
    "assistanceDaysAfterEDD" INTEGER NOT NULL,
    "parity" VARCHAR(12),
    "observation" TEXT,
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Patient" ADD CONSTRAINT "Patient_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
