import { ReviewItem } from "../repositories/store.repository.js";

export interface ReviewListResponse {
  data: ReviewItem[];
  pagination: {
    cursor: number | null;
  };
}