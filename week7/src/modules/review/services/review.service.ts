// review.service.ts
import { checkStoreExists, createReview, findMyReviews } from "./../repositories/review.repository.js";
import { CreateReviewRequest } from "../dtos/review.dto.js";
import { ValidationError, NotFoundError } from "../../../common/errors/error.js";

const bodyToReview = (body: CreateReviewRequest) => {
  if (!body.title || !body.content) {
    throw new ValidationError("title과 content를 작성해주세요.");
  }

  if (body.score < 1 || body.score > 5) {
    throw new ValidationError("score는 1에서 5 사이여야 합니다.");
  }

  return {
    title: body.title.trim(),
    content: body.content.trim(),
    score: body.score,
  };
};

export const createReviewService = async (
  memberId: number,
  storeId: number,
  body: CreateReviewRequest
) => {
  const exists = await checkStoreExists(storeId);
  if (!exists) {
    throw new NotFoundError("존재하지 않는 가게입니다.");
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