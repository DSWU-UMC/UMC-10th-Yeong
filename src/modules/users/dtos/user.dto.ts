
/**
 * 회원가입 요청 DTO
 * @property email - 유저 이메일 (로그인 시 사용)
 * @property name - 유저 이름
 * @property gender - 성별 (예: "male", "female")
 * @property birth - 생년월일 (ISO 8601, 예: "2000-01-01")
 * @property address - 기본 주소 (선택)
 * @property detailAddress - 상세 주소 (선택)
 * @property phoneNumber - 연락처
 * @property preferences - 선호 카테고리 ID 배열 (예: [1, 2])
 */
export interface UserSignUpRequest {
  /** 유저 이메일 (로그인 시 사용) */
  email: string;
  /** 유저 이름 */
  name: string;
  /** 성별 (예: "male", "female") */
  gender: string;
  /** 생년월일 (ISO 8601 날짜 문자열, 예: "2000-01-01") */
  birth: string;
  /** 기본 주소 (선택) */
  address?: string;
  /** 상세 주소 (선택) */
  detailAddress?: string;
  /** 연락처 */
  phoneNumber: string;
  /** 선호 카테고리 ID 배열 (예: [1, 2]) */
  preferences: number[];
}

/**
 * 회원가입 응답 DTO
 * @property userId - 생성된 사용자 ID
 * @property preferences - 사용자의 선호 카테고리 이름 배열
 */
export interface UserSignUpResponse {
  /** 생성된 사용자 ID */
  userId: number;
  /** 사용자의 선호 카테고리 이름 배열 */
  preferences: string[];
}