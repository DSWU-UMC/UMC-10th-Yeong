// 1. 회원가입 요청 데이터의 설계도를 만듭니다.

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface UserSignUpRequest {
  email: string;
  password: string; 
  name: string;
  gender: Gender;
  birth: string;
  address?: string;       // ?가 붙으면 '없을 수도 있음(선택)'이라는 뜻이에요!
  detailAddress?: string;
  phoneNumber: string;
  preferences: number[];
}

// 2. 요청받은 데이터를 우리 시스템에 맞는 데이터로 변환해주는 함수입니다. 
export const bodyToUser = (body: UserSignUpRequest) => {
  const validGenders = ['MALE', 'FEMALE', 'OTHER'];
  const gender = body.gender.toUpperCase();


  if (!validGenders.includes(gender)) {
    throw new Error('Invalid gender value');
  }

  const birth = new Date(body.birth);

  return {
    email: body.email,
    name: body.name,
    gender: body.gender,
    birth,
    address: body.address ?? "",
    detailAddress: body.detailAddress ?? "",
    phoneNumber: body.phoneNumber,
    preferences: body.preferences,
  };
};

interface UserResponse {
  id: number;
  email: string;
  name: string;
  gender: Gender;
  preferences: number[];
}

export const responseFromUser = (data: {
  user: any;
  preferences: any[];
}): UserResponse => {
  return {
    id: data.user.id,
    email: data.user.email,
    name: data.user.name,
    gender: data.user.gender,
    preferences: data.preferences.map((p) => p.id),
  };
};