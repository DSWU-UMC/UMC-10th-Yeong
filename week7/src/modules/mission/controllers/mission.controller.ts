import { Body, Controller, Post, Get, Patch, Route, Tags, Path } from "tsoa";
import { addMissionService, 
        challengeMissionService,
        getStoreMissionsService,
        getMyMissionsService,
        completeMissionService
       } from "./../services/mission.service.js";
import { ApiResponse, success } from "../../../common/responses/response.js";

const userId = 1;

@Route("stores/{storeId}/missions")
@Tags("Missions")
export class MissionController extends Controller {
  @Post()
  public async addMission(
    @Path() storeId: number,
    @Body() body: any,
  ): Promise<ApiResponse<{ missionId: number }>> {
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
  public async challengeMission(
    @Body() body: { missionId: number },
  ): Promise<ApiResponse<{ userMissionId: number; state: string }>> {
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