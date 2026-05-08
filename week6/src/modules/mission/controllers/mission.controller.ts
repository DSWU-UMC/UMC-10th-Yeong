import { Request, Response } from "express";
import { addMissionService, challengeMissionService } from "./../services/mission.service.js";

const userId = 1;

export const addMission = async (req: Request, res: Response) => {
  try {
    const storeId = Number(req.params.storeId);

    const missionId = await addMissionService(storeId, req.body);

    return res.status(201).json({
      missionId,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const challengeMission = async (req: Request, res: Response) => {
  try {
    //const memberId = req.user.id;
    const memberId = userId;
    const { missionId } = req.body;

    const userMissionId = await challengeMissionService(memberId, missionId);

    return res.status(201).json({
      userMissionId,
      state: "IN_PROGRESS",
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};