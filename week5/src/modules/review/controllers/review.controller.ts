// review.controller.ts
import { Request, Response } from "express";
import { createReviewService } from "./../services/review.service.js";
const userId = 1;

export const addReview = async (req: Request, res: Response) => {
  try {
    //const memberId = req.user.id;
    const memberId = userId;
    const storeId = Number(req.params.storeId);

    const reviewId = await createReviewService(memberId, storeId, req.body);

    return res.status(201).json({
      reviewId,
      createdAt: new Date(),
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};