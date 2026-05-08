import { prisma } from "../../../db.config.js";

// 가게 존재 여부
export const checkStoreExists = async (
  storeId: number
): Promise<boolean> => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  return !!store;
};

// 리뷰 생성
export const createReview = async (
  userId: number,
  storeId: number,
  title: string,
  content: string,
  score: number
): Promise<number> => {
  const review = await prisma.review.create({
    data: {
      userId,
      storeId,
      title,
      content,
      score,
    },
  });

  return review.id;
};

