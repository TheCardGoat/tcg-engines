import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectCard,
  expectPublicLog,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05RisingGundam072 } from "./072-rising-gundam.ts";

describe("Rising Gundam (GD05-072)", () => {
  describe("【When Linked】Choose 1 enemy Unit with 4 or less HP. Rest it.", () => {
    it("rests only the chosen enemy Unit with 4 or less HP", () => {
      const pilot = createMockPilot({ traits: ["gundam fighter"] });
      const eligible = createMockUnit({ hp: 4 });
      const ineligible = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd05RisingGundam072],
          resourceArea: activeResources(4),
        },
        { play: [eligible, ineligible] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.assignPilot(pilot, gd05RisingGundam072);
      expectPublicLog(engine, "gundam.move.assignPilot", { playerId: PLAYER_ONE });
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected When Linked rest target");
      expect(choice.legalTargetIds).toEqual([p2.unit(eligible).instanceId]);
      expect(choice.legalTargetIds).not.toContain(p2.unit(ineligible).instanceId);
      p1.must.resolveTargets(eligible);

      expectCard(p2, eligible).toBeRested();
      expectCard(p2, ineligible).toBeReady();
    });

    it("does not rest enemy Units while paired but not linked", () => {
      const wrongPilot = createMockPilot({ name: "Domon Kasshu", cost: 1 });
      const eligible = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [wrongPilot],
          play: [gd05RisingGundam072],
          resourceArea: activeResources(4),
        },
        { play: [eligible] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.assignPilot(wrongPilot, gd05RisingGundam072);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expectCard(p2, eligible).toBeReady().toBeIn("battleArea");
    });

    it("does not open a rest prompt when every enemy Unit has 5 or more HP", () => {
      const pilot = createMockPilot({ traits: ["gundam fighter"] });
      const sturdy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd05RisingGundam072],
          resourceArea: activeResources(4),
        },
        { play: [sturdy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.assignPilot(pilot, gd05RisingGundam072);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expectCard(p2, sturdy).toBeReady();
    });
  });
});
