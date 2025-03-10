-- CreateTable
CREATE TABLE "Receipt" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
