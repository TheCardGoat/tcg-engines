import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01CharSGelgoog023 } from "./023-char-s-gelgoog.ts";

describe("Char's Gelgoog (GD01-023)", () => {
  describe("【Activate･Main】Discard 1 (Zeon)/(Neo Zeon) Unit card：If a Pilot is not paired with this Unit, choose 1 (Newtype) Pilot card that is Lv.3 or lower from your trash. Pair it with this Unit.", () => {
    it("discards a Zeon Unit cost and pairs a Lv.3 Newtype Pilot from trash", () => {
      const costUnit = createMockUnit({ traits: ["zeon"], name: "Zeon Cost" });
      const pilot = createMockPilot({ traits: ["newtype"], level: 3 });
      const engine = GundamTestEngine.create({
        play: [gd01CharSGelgoog023],
        hand: [costUnit],
        trash: [pilot],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getCardsInZone("trash")[0]!;
      const costId = p1.getHand()[0]!;

      expectSuccess(p1.activateAbility(gd01CharSGelgoog023, 0, { targets: [pilotId] }));

      expect(engine.getG().pilotAssignments[unitId]).toBe(pilotId);
      expect(p1.getCardsInZone("battleArea")).toContain(pilotId);
      expect(p1.getCardsInZone("trash")).toContain(costId);
    });

    it("accepts a Neo Zeon Unit as the discard cost", () => {
      const costUnit = createMockUnit({ traits: ["neo zeon"], name: "Neo Zeon Cost" });
      const pilot = createMockPilot({ traits: ["newtype"], level: 2 });
      const engine = GundamTestEngine.create({
        play: [gd01CharSGelgoog023],
        hand: [costUnit],
        trash: [pilot],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const pilotId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.activateAbility(gd01CharSGelgoog023, 0, { targets: [pilotId] }));
    });

    it("cannot pay the cost with a Unit outside Zeon and Neo Zeon", () => {
      const costUnit = createMockUnit({ traits: ["earth federation"], name: "Wrong Cost" });
      const pilot = createMockPilot({ traits: ["newtype"], level: 2 });
      const engine = GundamTestEngine.create({
        play: [gd01CharSGelgoog023],
        hand: [costUnit],
        trash: [pilot],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const pilotId = p1.getCardsInZone("trash")[0]!;

      expectFailure(
        p1.activateAbility(gd01CharSGelgoog023, 0, { targets: [pilotId] }),
        "COST_NOT_PAYABLE",
      );
    });

    it("cannot pair a non-Newtype Pilot from trash", () => {
      const costUnit = createMockUnit({ traits: ["zeon"] });
      const pilot = createMockPilot({ traits: ["civilian"], level: 2 });
      const engine = GundamTestEngine.create({
        play: [gd01CharSGelgoog023],
        hand: [costUnit],
        trash: [pilot],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const pilotId = p1.getCardsInZone("trash")[0]!;

      expectFailure(
        p1.activateAbility(gd01CharSGelgoog023, 0, { targets: [pilotId] }),
        "ILLEGAL_TARGET",
      );
    });

    it("cannot pair a Lv.4 Newtype Pilot from trash", () => {
      const costUnit = createMockUnit({ traits: ["zeon"] });
      const pilot = createMockPilot({ traits: ["newtype"], level: 4 });
      const engine = GundamTestEngine.create({
        play: [gd01CharSGelgoog023],
        hand: [costUnit],
        trash: [pilot],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const pilotId = p1.getCardsInZone("trash")[0]!;

      expectFailure(
        p1.activateAbility(gd01CharSGelgoog023, 0, { targets: [pilotId] }),
        "ILLEGAL_TARGET",
      );
    });

    it("cannot activate while this Unit already has a paired Pilot", () => {
      const costUnit = createMockUnit({ traits: ["zeon"] });
      const pilot = createMockPilot({ traits: ["newtype"], level: 2 });
      const engine = GundamTestEngine.create({
        play: [gd01CharSGelgoog023],
        hand: [costUnit],
        trash: [pilot],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getCardsInZone("trash")[0]!;
      engine.getG().pilotAssignments[unitId] = "already-paired";

      expectFailure(
        p1.activateAbility(gd01CharSGelgoog023, 0, { targets: [pilotId] }),
        "CONDITIONS_NOT_MET",
      );
    });
  });
});
