import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { handleUserSignUp } from "./modules/users/controllers/user.controller.js";
import { addReview, getMyReviews } from "./modules/review/controllers/review.controller.js";
import { addMission, challengeMission, getStoreMissions, getMyMissions, completeMission } from "./modules/mission/controllers/mission.controller.js";
import { handleListStoreReviews } from "./modules/stores/controllers/store.controller.js";
console.log("week6 server running");

// 1. 환경 변수 설정
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// 2. 미들웨어 설정
app.use(cors());            // cors 방식 허용                 
app.use(express.static('public'));    // 정적 파일 접근      
app.use(express.json());              // request의 본문을 json으로 해석할 수 있도록 함(JSON 형태의 요청 body를 파싱하기 위함)     
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// 3. 기본 라우트
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! This is TypeScript Server!");
});

app.post("/api/v1/users/signup", handleUserSignUp);


app.post("/api/v1/stores/:storeId/reviews", addReview);
app.post("/api/v1/stores/:storeId/missions", addMission);
app.post("/api/v1/member-missions", challengeMission);

app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);

//내가 작성한 리뷰 목록
app.get("/api/v1/reviews", getMyReviews);
//특정 가게의 미션 목록
app.get("/api/v1/stores/:storeId/missions", getStoreMissions);
//내가 진행 중인 미션 목록
app.get("/api/v1/missions", getMyMissions);

//내가 진행 중인 미션을 진행 완료로 바꾸기
app.patch("/api/v1/member-missions/:memberMissionId", completeMission);


// 4. 서버 시작
app.listen(port, () => {
  console.log(`[server]: Server is running at <http://localhost>:${port}`);
});
