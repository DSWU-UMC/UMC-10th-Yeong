
// 요청 DTO
export interface UserSignUpRequest {
  email: string;
  name: string;
  gender: string;
  birth: string; // ISO 8601 날짜 문자열 (예: "2000-01-01")
  address?: string;
  detailAddress?: string;
  phoneNumber: string;
  preferences: number[];
}
//응답 DTO
export interface UserSignUpResponse {
  userId: number;
  preferences: string[];
}