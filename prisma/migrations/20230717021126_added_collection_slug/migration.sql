/*
  Warnings:

  - Added the required column `slug` to the `Collection` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Collection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "description" TEXT DEFAULT ''
);
INSERT INTO "new_Collection" ("createdAt", "description", "handle", "id", "title", "updatedAt") SELECT "createdAt", "description", "handle", "id", "title", "updatedAt" FROM "Collection";
DROP TABLE "Collection";
ALTER TABLE "new_Collection" RENAME TO "Collection";
CREATE UNIQUE INDEX "Collection_slug_key" ON "Collection"("slug");
CREATE UNIQUE INDEX "Collection_handle_key" ON "Collection"("handle");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
