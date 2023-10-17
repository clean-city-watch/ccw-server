-- DropForeignKey
ALTER TABLE "upvotes" DROP CONSTRAINT "upvotes_post_id_fkey";

-- DropForeignKey
ALTER TABLE "upvotes" DROP CONSTRAINT "upvotes_user_id_fkey";

-- DropTable
DROP TABLE "upvotes";

