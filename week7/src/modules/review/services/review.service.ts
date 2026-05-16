// review.service.ts
import { checkStoreExists, createReview, findMyReviews } from "./../repositories/review.repository.js";
import { bodyToReview, CreateReviewRequest } from "../dtos/review.dto.js";


export const createReviewService = async (
  memberId: number,
  storeId: number,
  body: CreateReviewRequest
) => {
  const exists = await checkStoreExists(storeId);
  if (!exists) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  const review = bodyToReview(body);

  const reviewId = await createReview(
    memberId,
    storeId,
    review.title,
    review.content,
    review.score
  );

  return reviewId;
};

export const getMyReviewsService = async (
  userId: number
) => {
  return await findMyReviews(userId);
};