// 미션 생성 요청
export interface CreateMissionRequest {
  content: string;
  dueDate: string;
}

// 미션 생성 응답
export interface MissionResponse {
  missionId: number;
}

// 미션 도전 요청
export interface ChallengeMissionRequest {
  missionId: number;
}

// 미션 도전 응답
export interface ChallengeMissionResponse {
  userMissionId: number;
  state: "IN_PROGRESS";
}


// 미션 생성 변환
export const bodyToMission = (body: CreateMissionRequest) => {
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

// 미션 도전 변환
export const bodyToChallengeMission = (body: ChallengeMissionRequest) => {
  if (!body.missionId) {
    throw new Error("missionId is required");
  }

  return {
    missionId: body.missionId,
  };
};

// 응답 변환
export const responseFromMission = (missionId: number) => {
  return {
    missionId,
  };
};

export const responseFromChallengeMission = (userMissionId: number) => {
  return {
    userMissionId,
    state: "IN_PROGRESS" as const,
  };
};