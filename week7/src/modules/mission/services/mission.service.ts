import { 
  checkStoreExists, 
  createMission, 
  checkMissionExists, 
  checkAlreadyChallenging, 
  createUserMission,
  findStoreMissions,
  findMyMissions,
  updateMissionState,
} from "../repositories/mission.repository.js";
import { CreateMissionRequest } from "../dtos/mission.dto.js";

const bodyToMission = (body: CreateMissionRequest) => {
  if (!body.content) {
    throw new Error("content is required");
  }

  const dueDate = new Date(body.dueDate);
  if (isNaN(dueDate.getTime())) {
    throw new Error("Invalid dueDate");
  }

  return {
    content: body.content.trim(),
    dueDate,
  };
};

export const addMissionService = async (
  storeId: number,
  body: any
) => {

  const missionData = bodyToMission(body);

  const exists = await checkStoreExists(storeId);

  if (!exists) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  const missionId = await createMission(
    storeId,
    missionData.content,
    missionData.dueDate
  );

  return missionId;
};

export const challengeMissionService = async (
  memberId: number,
  missionId: number
) => {
  const exists = await checkMissionExists(missionId);
  if (!exists) {
    throw new Error("존재하지 않는 미션입니다.");
  }

  const already = await checkAlreadyChallenging(memberId, missionId);
  if (already) {
    throw new Error("이미 도전 중인 미션입니다.");
  }

  return await createUserMission(memberId, missionId);
};

export const getStoreMissionsService = async (
  storeId: number
) => {
  return await findStoreMissions(storeId);
};


export const getMyMissionsService = async (
  userId: number
) => {
  return await findMyMissions(userId);
};


export const completeMissionService = async (
  memberMissionId: number
) => {
  return await updateMissionState(memberMissionId);
};