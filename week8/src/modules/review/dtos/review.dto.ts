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