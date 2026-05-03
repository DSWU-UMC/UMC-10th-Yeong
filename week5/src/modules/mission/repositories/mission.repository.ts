import { pool } from "../../../db.config.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// 가게 존재 여부
export const checkStoreExists = async (storeId: number): Promise<boolean> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT EXISTS(SELECT 1 FROM stores WHERE id = ?) as isExist;`,
      [storeId]
    );
    return rows[0]?.isExist === 1;
  } finally {
    conn.release();
  }
};

// 미션 생성
export const createMission = async (
  storeId: number,
  content: string,
  dueDate: Date
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO missions (store_id, content, due_date)
       VALUES (?, ?, ?);`,
      [storeId, content, dueDate]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
};

// 미션 존재 여부
export const checkMissionExists = async (missionId: number): Promise<boolean> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT EXISTS(SELECT 1 FROM missions WHERE id = ?) as isExist;`,
      [missionId]
    );
    return rows[0]?.isExist === 1;
  } finally {
    conn.release();
  }
};

// 이미 도전 중인지
export const checkAlreadyChallenging = async (
  memberId: number,
  missionId: number
): Promise<boolean> => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT EXISTS(
        SELECT 1 FROM member_missions 
        WHERE member_id = ? AND mission_id = ? AND state = 'IN_PROGRESS'
      ) as isExist;`,
      [memberId, missionId]
    );
    return rows[0]?.isExist === 1;
  } finally {
    conn.release();
  }
};

// 유저 미션 생성
export const createMemberMission = async (
  memberId: number,
  missionId: number
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO member_missions (member_id, mission_id, state)
       VALUES (?, ?, 'IN_PROGRESS');`,
      [memberId, missionId]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
};