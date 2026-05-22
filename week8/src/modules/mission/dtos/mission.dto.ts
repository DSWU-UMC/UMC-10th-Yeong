/**
 * 미션 생성 요청 DTO
 * @property content - 미션 내용
 * @property dueDate - 마감일 (ISO 8601 문자열)
 */
export interface CreateMissionRequest {
  /** 미션 내용 */
  content: string;
  /** 마감일 (ISO 8601 날짜 문자열) */
  dueDate: string;
}

/**
 * 미션 생성 응답 DTO
 * @property missionId - 생성된 미션 ID
 */
export interface MissionResponse {
  /** 생성된 미션 ID */
  missionId: number;
}

/**
 * 미션 도전 요청 DTO
 * @property missionId - 도전할 미션 ID
 */
export interface ChallengeMissionRequest {
  /** 도전할 미션 ID */
  missionId: number;
}

/**
 * 미션 도전 응답 DTO
 * @property userMissionId - 생성된 사용자 미션 ID
 * @property state - 현재 상태
 */
export interface ChallengeMissionResponse {
  /** 생성된 사용자 미션 ID */
  userMissionId: number;
  /** 현재 상태 (예: "IN_PROGRESS") */
  state: "IN_PROGRESS";
}

// 응답 변환 유틸
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