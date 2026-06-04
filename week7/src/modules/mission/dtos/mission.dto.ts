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