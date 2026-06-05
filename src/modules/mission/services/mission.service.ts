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
import { ValidationError, NotFoundError, ConflictError } from "../../../common/errors/error.js";

const bodyToMission = (body: CreateMissionRequest) => {
  if (!body.content) {
    throw new ValidationError("내용을 작성해주세요.");
  }

  const dueDate = new Date(body.dueDate);
  if (isNaN(dueDate.getTime())) {
    throw new ValidationError("유효하지 않은 dueDate입니다.");
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
    throw new NotFoundError("존재하지 않는 가게입니다.");
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
    throw new NotFoundError("존재하지 않는 미션입니다.");
  }

  const already = await checkAlreadyChallenging(memberId, missionId);
  if (already) {
    throw new ConflictError("이미 도전 중인 미션입니다.");
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