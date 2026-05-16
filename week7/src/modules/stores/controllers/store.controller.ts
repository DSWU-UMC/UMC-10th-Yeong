import { Controller, Get, Route, Tags, Path, Query } from "tsoa";
import { StatusCodes } from "http-status-codes";
import { listStoreReviews } from "../services/store.service.js";
import { ApiResponse, success } from "../../../common/responses/response.js";

@Route("stores/{storeId}/reviews")
@Tags("Stores")
export class StoreController extends Controller {
  @Get()
  public async handleListStoreReviews(
    @Path() storeId: number,
    @Query() cursor: number = 0
  ): Promise<ApiResponse<any[]>> {
    this.setStatus(StatusCodes.OK);
    const reviews = await listStoreReviews(storeId, cursor);
    return success(reviews.data ?? reviews);
  }
}