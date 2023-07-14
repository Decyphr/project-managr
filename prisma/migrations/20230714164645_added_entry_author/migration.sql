/*
  Warnings:

  - Added the required column `authorId` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Entry_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Entry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Entry" ("collectionId", "createdAt", "id", "slug", "title", "updatedAt") SELECT "collectionId", "createdAt", "id", "slug", "title", "updatedAt" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
CREATE UNIQUE INDEX "Entry_slug_key" ON "Entry"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
