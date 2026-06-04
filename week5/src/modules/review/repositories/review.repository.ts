import { pool } from "../../../db.config.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

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

// 리뷰 생성
export const createReview = async (
  memberId: number,
  storeId: number,
  title: string,
  content: string,
  score: number
): Promise<number> => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO reviews (member_id, store_id, title, content, score)
       VALUES (?, ?, ?, ?, ?);`,
      [memberId, storeId, title, content, score]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
};