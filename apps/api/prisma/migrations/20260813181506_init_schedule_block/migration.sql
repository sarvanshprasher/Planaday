-- CreateTable
CREATE TABLE "ScheduleBlock" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startHour" INTEGER NOT NULL,
    "endHour" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "createdBy" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "ScheduleBlock_pkey" PRIMARY KEY ("id")
);
