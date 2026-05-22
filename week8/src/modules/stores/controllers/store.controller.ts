import { Controller, Get, Route, Tags, Path, Query, Response } from "tsoa";
import { StatusCodes } from "http-status-codes";
import { listStoreReviews } from "../services/store.service.js";
import { ApiResponse, success } from "../../../common/responses/response.js";

@Route("stores/{storeId}/reviews")
@Tags("Stores")
export class StoreController extends Controller {
  @Get()
  /**
   * 매장 리뷰 목록 조회
   * @summary 특정 매장의 리뷰 목록을 페이징(커서) 방식으로 조회합니다.
   * @param storeId 매장 ID (Path)
   * @param cursor 페이지 커서 (Query)
   * @returns 리뷰 배열
   */
  @Response(400, "리뷰 목록 조회 실패 - 잘못된 요청")
  @Response(200, "조회 성공")
  public async handleListStoreReviews(
    @Path() storeId: number,
    @Query() cursor: number = 0
  ): Promise<ApiResponse<any[]>> {
    this.setStatus(StatusCodes.OK);
    const reviews = await listStoreReviews(storeId, cursor);
    return success(reviews.data ?? reviews);
  }
}