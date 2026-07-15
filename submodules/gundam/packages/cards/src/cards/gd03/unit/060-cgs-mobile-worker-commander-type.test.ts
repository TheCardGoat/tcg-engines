import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03ImprovedTechnique109 } from "../command/109-improved-technique.ts";
import { st05WithIronAndBlood013 } from "../../st05/command/013-with-iron-and-blood.ts";
import { gd03CgsMobileWorkerCommanderType060 } from "./060-cgs-mobile-worker-commander-type.ts";

describe("CGS Mobile Worker (Commander Type) (GD03-060)", () => {
  describe("【Once per Turn】During your turn, when this Unit receives effect damage, deploy 1 rested [CGS Mobile Worker]((Tekkadan)･AP1･HP1) Unit token.", () => {
    function tokenIds(engine: GundamTestEngine, commanderId: string) {
      const p1 = engine.asPlayer(PLAYER_ONE);
      const pilotId = p1.getPilotId(commanderId);
      return p1.getCardsInZone("battleArea").filter((id) => id !== commanderId && id !== pilotId);
    }

    it("deploys a rested CGS Mobile Worker token when it receives effect damage during your turn", () => {
      const engine = GundamTestEngine.create({
        hand: [st05WithIronAndBlood013],
        play: [gd03CgsMobileWorkerCommanderType060],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commanderId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st05WithIronAndBlood013, { targets: [commanderId] }));

      const [tokenId] = tokenIds(engine, commanderId);
      expect(p1.getVisibleCard(tokenId!)).toMatchObject({
        effectiveAp: 1,
        effectiveHp: 1,
        exhausted: true,
      });
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("does not deploy a token when it receives effect damage during the opponent's turn", () => {
      const engine = GundamTestEngine.create(
        { play: [gd03CgsMobileWorkerCommanderType060] },
        { hand: [gd03ImprovedTechnique109], resourceArea: activeResources(3) },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commanderId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.playCommand(gd03ImprovedTechnique109, { targets: [commanderId] }));

      expect(tokenIds(engine, commanderId)).toHaveLength(0);
    });

    it("deploys only once per turn", () => {
      const pilot = createMockPilot({ cost: 1, hpBonus: 3 });
      const engine = GundamTestEngine.create({
        hand: [pilot, st05WithIronAndBlood013, st05WithIronAndBlood013],
        play: [gd03CgsMobileWorkerCommanderType060],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commanderId = p1.getCardsInZone("battleArea")[0]!;
      const [pilotId, firstCommandId, secondCommandId] = p1.getHand();

      expectSuccess(p1.assignPilot(pilotId!, commanderId));
      expectSuccess(p1.playCommand(firstCommandId!, { targets: [commanderId] }));
      expectSuccess(p1.playCommand(secondCommandId!, { targets: [commanderId] }));

      expect(tokenIds(engine, commanderId)).toHaveLength(1);
    });
  });
});
