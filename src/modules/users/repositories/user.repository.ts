import { prisma } from "../../../db.config.js";

// 1. User 데이터 생성 또는 업데이트
export const addUser = async (data: any) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

  if (existingUser) {
    const updated = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: data.name,
        gender: data.gender,
        birth: data.birth,
        address: data.address,
        detailAddress: data.detailAddress,
        phoneNumber: data.phoneNumber,
      },
    });
    return updated.id;
  }

  const created = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
    },
  });

  return created.id;
};

export const clearUserPreferences = async (userId: number) => {
  await prisma.userFavorCategory.deleteMany({ where: { userId } });
};

export const getUser = async (userId: number) => {
  return await prisma.user.findFirstOrThrow({ where: { id: userId } });
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId: number, foodCategoryId: number) => {
  await prisma.userFavorCategory.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

// 사용자 선호 카테고리 반환 (JOIN)
export const getUserPreferencesByUserId = async (userId: number) => {
  return await prisma.userFavorCategory.findMany({
    where: { userId: userId },
    include: {
      foodCategory: true, // 💡 핵심: JOIN 대신 include를 써서 연관 데이터를 가져옵니다!
    },
    orderBy: { foodCategoryId: "asc" },
  });
};