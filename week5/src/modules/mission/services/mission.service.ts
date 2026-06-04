import { checkStoreExists, createMission, checkMissionExists, checkAlreadyChallenging, createMemberMission } from "../repositories/mission.repository.js";

export const addMissionService = async (storeId: number, body: any) => {
  const { content, dueDate } = body;

  const exists = await checkStoreExists(storeId);
  if (!exists) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  const missionId = await createMission(storeId, content, dueDate);

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

  return await createMemberMission(memberId, missionId);
};