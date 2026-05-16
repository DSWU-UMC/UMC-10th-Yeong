import { Body, Controller, Post, Get, Route, Tags, Path } from "tsoa";
import { createReviewService, getMyReviewsService } from "./../services/review.service.js";

const userIdForTest = 1;

@Route("stores/{storeId}/reviews")
@Tags("Reviews")
export class ReviewController extends Controller {
  @Post()
  public async addReview(
    @Path() storeId: number,
    @Body() body: any,
  ): Promise<{ reviewId: number; createdAt: Date }> {
    try {
      const userId = userIdForTest;
      const reviewId = await createReviewService(userId, storeId, body);
      return {
        reviewId,
        createdAt: new Date(),
      };
    } catch (err: any) {
      this.setStatus(400);
      throw err;
    }
  }
}

@Route("reviews")
@Tags("Reviews")
export class MyReviewController extends Controller {
  @Get()
  public async getMyReviews(): Promise<{ data: any[] }> {
    try {
      const userId = userIdForTest;
      const reviews = await getMyReviewsService(userId);
      return {
        data: reviews,
      };
    } catch (err: any) {
      this.setStatus(400);
      throw err;
    }
  }
}