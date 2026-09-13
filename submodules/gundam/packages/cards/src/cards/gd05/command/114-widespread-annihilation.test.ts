import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd05WidespreadAnnihilation114 } from "./114-widespread-annihilation.ts";

describe("Widespread Annihilation (GD05-114)", () => {
  /** @behavioral-proof complete: Main timing, all-player Lv.4 boundary, no-target branch, level requirement, resource cost, and destinations are public. */
  describe("【Main】Destroy all Units that are Lv.4 or lower.", () => {
    it("destroys every friendly and enemy Unit at Lv.4 or lower and leaves higher-level Units", () => {
      const friendlyLow = createMockUnit({ name: "Friendly Low", level: 4, hp: 6 });
      const friendlyHigh = createMockUnit({ name: "Friendly High", level: 5, hp: 6 });
      const enemyLow = createMockUnit({ name: "Enemy Low", level: 3, hp: 6 });
      const enemyHigh = createMockUnit({ name: "Enemy High", level: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05WidespreadAnnihilation114],
          play: [friendlyLow, friendlyHigh],
          resourceArea: activeResources(6),
        },
        { play: [enemyLow, enemyHigh] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const [friendlyLowId, friendlyHighId] = p1.getCardsInZone("battleArea");
      const [enemyLowId, enemyHighId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(commandId));

      expect(p1.getCardZone(friendlyLowId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(enemyLowId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getCardZone(friendlyHighId!)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p2.getCardZone(enemyHighId!)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("resolves cleanly when no Unit meets the level filter", () => {
      const highLevel = createMockUnit({ level: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        { hand: [gd05WidespreadAnnihilation114], resourceArea: activeResources(6) },
        { play: [highLevel] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const highLevelId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(commandId));

      expect(p2.getCardZone(highLevelId)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("cannot be played below its printed Lv.6 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05WidespreadAnnihilation114],
        resourceArea: activeResources(5),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(gd05WidespreadAnnihilation114),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("cannot pay its printed cost without 6 active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05WidespreadAnnihilation114],
        resourceArea: restedResources(6),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(gd05WidespreadAnnihilation114),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });
});
