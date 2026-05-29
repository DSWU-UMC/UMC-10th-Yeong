import { ReviewItem } from "../repositories/store.repository.js";

/**
 * 매장 리뷰 목록 응답 DTO
 * @property data - 리뷰 항목 배열
 * @property pagination.cursor - 다음 페이지를 위한 커서 (없으면 null)
 */
export interface ReviewListResponse {
  /** 리뷰 항목 배열 */
  data: ReviewItem[];
  /** 페이징 정보 */
  pagination: {
    /** 다음 페이지를 위한 커서 (없으면 null) */
    cursor: number | null;
  };
}