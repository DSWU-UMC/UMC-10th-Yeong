import { Request, Response } from "express";
import { addMissionService, 
        challengeMissionService,
        getStoreMissionsService,
        getMyMissionsService,
        completeMissionService
       } from "./../services/mission.service.js";

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

export const getStoreMissions = async (req: Request, res: Response) => {
  try {
    const storeId = Number(req.params.storeId);

    const missions = await getStoreMissionsService(storeId);

    return res.status(200).json({
      data: missions,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const getMyMissions = async (req: Request, res: Response) => {
  try {
    const missions = await getMyMissionsService(userId);

    return res.status(200).json({
      data: missions,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

export const completeMission = async (req: Request, res: Response) => {
  try {
    const memberMissionId = Number(req.params.memberMissionId);

    const result = await completeMissionService(memberMissionId);

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({
      message: err.message,
    });
  }
};