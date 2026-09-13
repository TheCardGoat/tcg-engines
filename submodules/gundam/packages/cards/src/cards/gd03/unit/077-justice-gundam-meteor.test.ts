import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectCard,
  expectPlayer,
  expectPublicLog,
} from "@tcg/gundam-engine";
import { st04AthrunZala011 } from "../../st04/pilot/011-athrun-zala.ts";
import { gd03JusticeGundamMeteor077 } from "./077-justice-gundam-meteor.ts";

describe("Justice Gundam (METEOR) (GD03-077)", () => {
  describe("【When Linked】Choose 1 to 3 enemy Units with 3 or less HP. Return them to their owners' hands.", () => {
    it("returns 1 to 3 chosen enemy Units with 3 or less HP to hand", () => {
      const weakA = createMockUnit({ hp: 3 });
      const weakB = createMockUnit({ hp: 3 });
      const weakC = createMockUnit({ hp: 3 });
      const hp4Excluded = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04AthrunZala011],
          play: [gd03JusticeGundamMeteor077],
          resourceArea: activeResources(8),
        },
        { play: [weakA, weakB, weakC, hp4Excluded] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.unit(gd03JusticeGundamMeteor077).instanceId;

      p1.must.assignPilot(st04AthrunZala011, gd03JusticeGundamMeteor077);
      expectPublicLog(engine, "gundam.move.assignPilot", { playerId: PLAYER_ONE });

      const ordering = p1.getBoardView().pendingChoice;
      if (ordering?.kind !== "ordering") throw new Error("Expected When Linked ordering");
      const justiceEffect = ordering.candidates.find(
        (candidate) => candidate.sourceCardId === unitId,
      );
      p1.must.resolveEffect({ pendingEffectId: justiceEffect!.effectId });

      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected target selection");
      expect(choice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.arrayContaining([
          p2.unit(weakA).instanceId,
          p2.unit(weakB).instanceId,
          p2.unit(weakC).instanceId,
        ]),
        minTargets: 1,
        maxTargets: 3,
      });
      expect(choice.legalTargetIds).not.toContain(p2.unit(hp4Excluded).instanceId);
      expect(choice.legalTargetIds).toHaveLength(3);
      p1.must.resolveEffect({ targets: [weakA, weakB, weakC] });

      expectCard(p2, weakA).toBeIn("hand");
      expectCard(p2, weakB).toBeIn("hand");
      expectCard(p2, weakC).toBeIn("hand");
      expectPlayer(p2).toHaveZoneCount("battleArea", 1);
      expectCard(p2, hp4Excluded).toBeIn("battleArea");
    });

    it("allows choosing one of two eligible enemy Units (minimum count)", () => {
      const weakA = createMockUnit({ hp: 1 });
      const weakB = createMockUnit({ hp: 2 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04AthrunZala011],
          play: [gd03JusticeGundamMeteor077],
          resourceArea: activeResources(8),
        },
        { play: [weakA, weakB] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.unit(gd03JusticeGundamMeteor077).instanceId;

      p1.must.assignPilot(st04AthrunZala011, gd03JusticeGundamMeteor077);
      const ordering = p1.getBoardView().pendingChoice;
      if (ordering?.kind === "ordering") {
        const justiceEffect = ordering.candidates.find(
          (candidate) => candidate.sourceCardId === unitId,
        );
        p1.must.resolveEffect({ pendingEffectId: justiceEffect!.effectId });
      }
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected target selection");
      expect(choice.maxTargets).toBe(2);
      expect(choice.minTargets).toBe(1);
      p1.must.resolveTargets(weakA);

      expectCard(p2, weakA).toBeIn("hand");
      expectCard(p2, weakB).toBeIn("battleArea");
    });

    it("excludes enemy Units with exactly 4 HP from the legal target set", () => {
      const weak = createMockUnit({ hp: 3 });
      const hp4 = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04AthrunZala011],
          play: [gd03JusticeGundamMeteor077],
          resourceArea: activeResources(8),
        },
        { play: [weak, hp4] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.unit(gd03JusticeGundamMeteor077).instanceId;

      p1.must.assignPilot(st04AthrunZala011, gd03JusticeGundamMeteor077);
      const ordering = p1.getBoardView().pendingChoice;
      if (ordering?.kind === "ordering") {
        const justiceEffect = ordering.candidates.find(
          (candidate) => candidate.sourceCardId === unitId,
        );
        p1.must.resolveEffect({ pendingEffectId: justiceEffect!.effectId });
      }
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected target selection");
      expect(choice.legalTargetIds).toEqual([p2.unit(weak).instanceId]);
      expect(choice.legalTargetIds).not.toContain(p2.unit(hp4).instanceId);
      p1.must.resolveTargets(weak);

      expectCard(p2, weak).toBeIn("hand");
      expectCard(p2, hp4).toBeIn("battleArea");
    });

    it("does not return enemy Units while paired but not linked", () => {
      const wrongPilot = createMockPilot({ name: "Kira Yamato", cost: 1 });
      const weakA = createMockUnit({ hp: 3 });
      const weakB = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [wrongPilot],
          play: [gd03JusticeGundamMeteor077],
          resourceArea: activeResources(8),
        },
        { play: [weakA, weakB] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.assignPilot(wrongPilot, gd03JusticeGundamMeteor077);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expectCard(p2, weakA).toBeIn("battleArea");
      expectCard(p2, weakB).toBeIn("battleArea");
      expectPlayer(p2).toHaveHandCount(0);
    });
  });
});
