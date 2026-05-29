import { prisma } from "../../../db.config.js";

export interface ReviewItem {
  id: number;
  content: string;
  store: any;
  user: any;
}

export const getAllStoreReviews = async (
  storeId: number,
  cursor: number
): Promise<ReviewItem[]> => {
  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      content: true,
      store: true,
      user: true,
    },
    where: {
      storeId,
      id: {
        gt: cursor,
      },
    },
    orderBy: {
      id: "asc",
    },
    take: 5,
  });

  return reviews;
};