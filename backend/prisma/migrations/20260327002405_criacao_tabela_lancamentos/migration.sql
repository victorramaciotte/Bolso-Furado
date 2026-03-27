-- CreateTable
CREATE TABLE "Lancamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "origem" TEXT,
    "tipo" TEXT NOT NULL,
    "motivacao" TEXT,
    "status" TEXT NOT NULL,
    "recorrencia" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFR" DATETIME,
    "categoria" TEXT
);
