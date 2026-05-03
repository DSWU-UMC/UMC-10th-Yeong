// 요청 DTO
export interface CreateReviewRequest {
  title: string;
  content: string;
  score: number;
}

// 응답 DTO
export interface ReviewResponse {
  reviewId: number;
  createdAt: Date;
}

// body → 내부 데이터 변환
export const bodyToReview = (body: CreateReviewRequest) => {
  if (!body.title || !body.content) {
    throw new Error("title and content are required");
  }

  if (body.score < 1 || body.score > 5) {
    throw new Error("score must be between 1 and 5");
  }

  return {
    title: body.title.trim(),
    content: body.content.trim(),
    score: body.score,
  };
};

// 응답 변환
export const responseFromReview = (reviewId: number): ReviewResponse => {
  return {
    reviewId,
    createdAt: new Date(),
  };
};