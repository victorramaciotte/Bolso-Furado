/*
  Warnings:

  - You are about to drop the column `origin` on the `Entry` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "source" TEXT,
    "type" TEXT NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL,
    "recurrence" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "category" TEXT
);
INSERT INTO "new_Entry" ("category", "date", "endDate", "id", "name", "reason", "recurrence", "status", "type", "value") SELECT "category", "date", "endDate", "id", "name", "reason", "recurrence", "status", "type", "value" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
