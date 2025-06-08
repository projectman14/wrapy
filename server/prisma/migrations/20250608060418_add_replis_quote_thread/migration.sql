-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "parentId" INTEGER,
ADD COLUMN     "quoteOfId" INTEGER,
ADD COLUMN     "threadRootId" INTEGER;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_threadRootId_fkey" FOREIGN KEY ("threadRootId") REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_quoteOfId_fkey" FOREIGN KEY ("quoteOfId") REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
