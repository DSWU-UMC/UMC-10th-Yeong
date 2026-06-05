/**
 * 리뷰 생성 요청 DTO
 * @property title - 리뷰 제목
 * @property content - 리뷰 내용
 * @property score - 평점 (예: 1-5)
 */
export interface CreateReviewRequest {
  /** 리뷰 제목 */
  title: string;
  /** 리뷰 내용 */
  content: string;
  /** 평점 (숫자, 예: 1-5) */
  score: number;
}

/**
 * 리뷰 응답 DTO
 * @property reviewId - 생성된 리뷰 ID
 * @property createdAt - 생성 일시
 */
export interface ReviewResponse {
  /** 생성된 리뷰 ID */
  reviewId: number;
  /** 생성 일시 */
  createdAt: Date;
}