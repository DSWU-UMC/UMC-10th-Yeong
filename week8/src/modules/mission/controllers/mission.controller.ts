import { Body, Controller, Post, Get, Patch, Route, Tags, Path, Response, Example } from "tsoa";
import { addMissionService, 
        challengeMissionService,
        getStoreMissionsService,
        getMyMissionsService,
        completeMissionService
       } from "./../services/mission.service.js";
import { ApiResponse, success } from "../../../common/responses/response.js";
import { CreateMissionRequest, MissionResponse, ChallengeMissionRequest, ChallengeMissionResponse } from "../dtos/mission.dto.js";

const userId = 1;

@Route("stores/{storeId}/missions")
@Tags("Missions")
export class MissionController extends Controller {
  @Post()
  /**
   * 미션 추가
   * @summary 매장에 미션(챌린지)을 추가합니다.
   * @param storeId 매장 ID (Path)
   * @param body 미션 데이터 (Body)
   * @returns 생성된 미션 ID
   */
  @Response(400, "미션 추가 실패 - 잘못된 요청")
  @Response(201, "미션 생성 성공")
  @Example<CreateMissionRequest>({
    content: "매장에서 사진 찍기",
    dueDate: "2026-06-30"
  })
  @Example<MissionResponse>({ missionId: 10 })
  public async addMission(
    @Path() storeId: number,
    @Body() body: CreateMissionRequest,
  ): Promise<ApiResponse<MissionResponse>> {
    try {
      const missionId = await addMissionService(storeId, body);
      this.setStatus(201);
      return success({
        missionId,
      });
    } catch (err: any) {
      this.setStatus(400);
      throw err;
    }
  }

  @Get()
  /**
   * 매장 미션 목록 조회
   * @summary 특정 매장의 미션 목록을 조회합니다.
   * @param storeId 매장 ID (Path)
   * @returns 미션 배열
   */
  @Response(400, "미션 조회 실패 - 잘못된 요청")
  @Response(200, "조회 성공")
  @Example<any[]>([
    { missionId: 1, content: "샘플 미션", dueDate: "2026-06-01" }
  ])
  public async getStoreMissions(
    @Path() storeId: number,
  ): Promise<ApiResponse<any[]>> {
    try {
      const missions = await getStoreMissionsService(storeId);
      return success(missions);
    } catch (err: any) {
      this.setStatus(400);
      throw err;
    }
  }
}

@Route("member-missions")
@Tags("Missions")
export class UserMissionController extends Controller {
  @Post()
  /**
   * 미션 도전(참여)
   * @summary 사용자가 미션에 도전합니다.
   * @param body { missionId: number }
   * @returns 생성된 유저미션 ID 및 상태
   */
  @Response(400, "도전 실패 - 잘못된 요청")
  @Response(201, "도전 성공")
  @Example<ChallengeMissionRequest>({ missionId: 5 })
  @Example<ChallengeMissionResponse>({ userMissionId: 100, state: "IN_PROGRESS" })
  public async challengeMission(
    @Body() body: ChallengeMissionRequest,
  ): Promise<ApiResponse<ChallengeMissionResponse>> {
    try {
      const memberId = userId;
      const userMissionId = await challengeMissionService(memberId, body.missionId);
      this.setStatus(201);
      return success({
        userMissionId,
        state: "IN_PROGRESS",
      });
    } catch (err: any) {
      this.setStatus(400);
      throw err;
    }
  }

  @Patch("{memberMissionId}")
  /**
   * 미션 완료 처리
   * @summary 참여 중인 미션을 완료 처리합니다.
   * @param memberMissionId 유저 미션 ID (Path)
   * @returns 완료 결과
   */
  @Response(400, "완료 처리 실패 - 잘못된 요청")
  @Response(200, "완료 성공")
  @Example<any>({ success: true })
  public async completeMission(
    @Path() memberMissionId: number,
  ): Promise<ApiResponse<any>> {
    try {
      const result = await completeMissionService(memberMissionId);
      return success(result);
    } catch (err: any) {
      this.setStatus(400);
      throw err;
    }
  }
}

@Route("missions")
@Tags("Missions")
export class MyMissionController extends Controller {
  @Get()
  /**
   * 내 미션 조회
   * @summary 로그인한 사용자의 미션 목록을 조회합니다.
   * @returns 사용자의 미션 배열
   */
  @Response(400, "미션 조회 실패 - 잘못된 요청")
  @Response(200, "조회 성공")
  public async getMyMissions(): Promise<ApiResponse<any[]>> {
    try {
      const missions = await getMyMissionsService(userId);
      return success(missions);
    } catch (err: any) {
      this.setStatus(400);
      throw err;
    }
  }
}