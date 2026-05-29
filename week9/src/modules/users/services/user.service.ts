import { UserSignUpRequest, UserSignUpResponse } from "../dtos/user.dto.js"; //인터페이스 가져오기
import {
  addUser,
  clearUserPreferences,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

export const userSignUp = async (data: UserSignUpRequest): Promise<UserSignUpResponse> => {
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: new Date(data.birth), // 문자열을 Date 객체로 변환해서 넘겨줍니다.
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  await clearUserPreferences(joinUserId);

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const userId = user!.id;
  const preferences = (await getUserPreferencesByUserId(joinUserId)).map(
    (obj) => obj.foodCategory.name,
  );
  return <UserSignUpResponse>{
    userId,
    preferences,
  };
};
