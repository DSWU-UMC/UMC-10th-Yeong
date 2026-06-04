import { Body, Controller, Post, Get, Route, Tags, Path, Response, Example, Request, Middlewares } from "tsoa";
import { createReviewService, getMyReviewsService } from "../services/review.service.js";
import { ApiResponse, success } from "../../../common/responses/response.js";
import { CreateReviewRequest, ReviewResponse } from "../dtos/review.dto.js";
import { authorizeUser } from "../../../common/middlewares/auth.middleware.js";
import { Request as ExpressRequest } from "express";


@Route("stores/{storeId}/reviews")
@Tags("Reviews")
export class ReviewController extends Controller {
  @Post()
  /**
   * 리뷰 작성
   * @summary 특정 매장에 리뷰를 등록합니다.
   * @param storeId 매장 ID (Path)
   * @param body 리뷰 데이터 (Body)
   * @returns 등록된 리뷰 ID와 생성일자
   */
  @Response(400, "리뷰 등록 실패 - 잘못된 요청")
  @Response(401, "인증 실패 - 로그인 필요")
  @Response(201, "리뷰 등록 성공")
  @Example<CreateReviewRequest>({
    title: "맛있어요",
    content: "음식이 정말 맛있고 서비스도 친절했습니다.",
    score: 5
  })
  @Example<ReviewResponse>({
    reviewId: 123,
    createdAt: new Date()
  })
  @Middlewares(authorizeUser())
  public async addReview(
    @Path() storeId: number,
    @Body() body: CreateReviewRequest,
    @Request() req: ExpressRequest,
  ): Promise<ApiResponse<ReviewResponse>> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        this.setStatus(401);
        throw new Error("로그인이 필요합니다.");
      }

      const reviewId = await createReviewService(userId, storeId, body);
      return success({
        reviewId,
        createdAt: new Date(),
      });
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
  /**
   * 내 리뷰 조회
   * @summary 로그인한 사용자의 리뷰 목록을 조회합니다.
   * @returns 사용자가 작성한 리뷰 배열
   */
  @Response(400, "리뷰 조회 실패 - 잘못된 요청")
  @Response(401, "인증 실패 - 로그인 필요")
  @Response(200, "조회 성공")
  @Example<ReviewResponse[]>([
    { reviewId: 1, createdAt: new Date() }
  ])
  @Middlewares(authorizeUser())
  public async getMyReviews(
    @Request() req: ExpressRequest,
  ): Promise<ApiResponse<any[]>> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        this.setStatus(401);
        throw new Error("로그인이 필요합니다.");
      }
      const reviews = await getMyReviewsService(userId);
      return success(reviews);
    } catch (err: any) {
      this.setStatus(400);
      throw err;
    }
  }
}