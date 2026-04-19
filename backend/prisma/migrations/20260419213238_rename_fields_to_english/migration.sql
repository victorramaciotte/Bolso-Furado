/*
  Warnings:

  - You are about to drop the `Lancamento` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Lancamento";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Entry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "origin" TEXT,
    "type" TEXT NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL,
    "recurrence" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "category" TEXT
);
