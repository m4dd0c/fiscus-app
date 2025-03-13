/*
  Warnings:

  - You are about to drop the column `source` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Receipt` table. All the data in the column will be lost.
  - Added the required column `destinationAccountId` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationUserId` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceAccountId` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceUserId` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transferId` to the `Receipt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_userId_fkey";

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "source",
DROP COLUMN "userId",
ADD COLUMN     "destinationAccountId" TEXT NOT NULL,
ADD COLUMN     "destinationUserId" INTEGER NOT NULL,
ADD COLUMN     "sourceAccountId" TEXT NOT NULL,
ADD COLUMN     "sourceUserId" INTEGER NOT NULL,
ADD COLUMN     "transferId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_sourceUserId_fkey" FOREIGN KEY ("sourceUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_destinationUserId_fkey" FOREIGN KEY ("destinationUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
