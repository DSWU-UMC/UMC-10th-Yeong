import { Body, Controller, Post, Get, Patch, Route, Tags, Path } from "tsoa";
import { addMissionService, 
        challengeMissionService,
        getStoreMissionsService,
        getMyMissionsService,
        completeMissionService
       } from "./../services/mission.service.js";

const userId = 1;

@Route("stores/{storeId}/missions")
@Tags("Missions")
export class MissionController extends Controller {
  @Post()
  public async addMission(
    @Path() storeId: number,
    @Body() body: any,
  ): Promise<{ missionId: number }> {
    try {
      const missionId = await addMissionService(storeId, body);
      this.setStatus(201);
      return {
        missionId,
      };
    } catch (err: any) {
      this.setStatus(400);
      throw err;
    }
  }

  @Get()
  public async getStoreMissions(
    @Path() storeId: number,
  ): Promise<{ data: any[] }> {
    try {
      const missions = await getStoreMissionsService(storeId);
      return {
        data: missions,
      };
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
  ): Promise<{ userMissionId: number; state: string }> {
    try {
      const memberId = userId;
      const userMissionId = await challengeMissionService(memberId, body.missionId);
      this.setStatus(201);
      return {
        userMissionId,
        state: "IN_PROGRESS",
      };
    } catch (err: any) {
      this.setStatus(400);
      throw err;
    }
  }

  @Patch("{memberMissionId}")
  public async completeMission(
    @Path() memberMissionId: number,
  ): Promise<any> {
    try {
      const result = await completeMissionService(memberMissionId);
      return result;
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
  public async getMyMissions(): Promise<{ data: any[] }> {
    try {
      const missions = await getMyMissionsService(userId);
      return {
        data: missions,
      };
    } catch (err: any) {
      this.setStatus(400);
      throw err;
    }
  }
}