import { prisma } from "../../../db.config.js";

// 가게 존재 여부
export const checkStoreExists = async (
  storeId: number
): Promise<boolean> => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  return !!store;
};

// 미션 생성
export const createMission = async (
  storeId: number,
  content: string,
  dueDate: Date
): Promise<number> => {
  const mission = await prisma.mission.create({
    data: {
      storeId,
      content,
      dueDate,
    },
  });

  return mission.id;
};

// 미션 존재 여부
export const checkMissionExists = async (
  missionId: number
): Promise<boolean> => {
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
  });

  return !!mission;
};

// 이미 도전 중인지
export const checkAlreadyChallenging = async (
  userId: number,
  missionId: number
): Promise<boolean> => {
  const userMission = await prisma.userMission.findFirst({
    where: {
      userId,
      missionId,
      state: "IN_PROGRESS",
    },
  });

  return !!userMission;
};

// 유저 미션 생성
export const createUserMission = async (
  userId: number,
  missionId: number
): Promise<number> => {
  const userMission = await prisma.userMission.create({
    data: {
      userId,
      missionId,
      state: "IN_PROGRESS",
    },
  });

  return userMission.id;
};


export const findStoreMissions = async (
  storeId: number
) => {
  return await prisma.mission.findMany({
    where: {
      storeId,
    },
    orderBy: {
      id: "desc",
    },
  });
};


export const findMyMissions = async (
  userId: number
) => {
  return await prisma.userMission.findMany({
    where: {
      userId,
      state: "IN_PROGRESS",
    },
    include: {
      mission: true,
    },
  });
};


export const updateMissionState = async (
  memberMissionId: number
) => {
  return await prisma.userMission.update({
    where: {
      id: memberMissionId,
    },
    data: {
      state: "COMPLETE",
    },
  });
};