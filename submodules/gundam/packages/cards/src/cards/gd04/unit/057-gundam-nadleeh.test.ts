import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundamNadleeh057 } from "./057-gundam-nadleeh.ts";

describe("Gundam Nadleeh (GD04-057)", () => {
  describe('【Deploy】Choose 1 enemy Unit that is Lv.6 or lower. During this turn, reduce its AP by an amount equal to the number of Unit cards with "Gundam Virtue" in their card names in your trash.', () => {
    it("shows the reduced AP on the chosen enemy Unit", () => {
      const virtue = createMockUnit({ name: "Gundam Virtue" });
      const virtueTransAm = createMockUnit({ name: "Gundam Virtue (Trans-Am)" });
      const nonVirtue = createMockUnit({ name: "Gundam Kyrios" });
      const enemy = createMockUnit({ name: "Enemy Target", level: 6, ap: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04GundamNadleeh057],
          trash: [virtue, virtueTransAm, nonVirtue],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd04GundamNadleeh057, { targets: [enemyId] }));

      expect(p1.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
    });

    it("does not let the player choose a Lv.7 enemy Unit", () => {
      const enemy = createMockUnit({ name: "Enemy Target", level: 7, ap: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04GundamNadleeh057],
          trash: [createMockUnit({ name: "Gundam Virtue" })],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(p1.deployUnit(gd04GundamNadleeh057, { targets: [enemyId] }), "INVALID_TARGET");

      expect(p1.getCardZone(gd04GundamNadleeh057)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
    });
  });
});
