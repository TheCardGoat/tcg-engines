import { describe, expect, it } from "vite-plus/test";
import { createMockUnit, expectSuccess, GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exrExResource008 } from "./008-ex-resource.ts";

describe("EX Resource (EXR-008)", () => {
  describe("Rest an EX Resource then exile it from the game when paying a cost.", () => {
    it("ceases to exist after paying a Unit's cost", () => {
      const unit = createMockUnit({ level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [unit],
        resourceArea: [{ card: exrExResource008, isToken: true }],
      });
      const player = engine.asPlayer(PLAYER_ONE);
      const resourceId = player.getCardsInZone("resourceArea")[0]!;

      expect(player.isExhausted(resourceId)).toBe(false);
      expectSuccess(player.deployUnit(unit));

      expect(player.getCardsInZone("resourceArea")).not.toContain(resourceId);
      expect(player.getCardZone(resourceId)).toBeUndefined();
    });
  });
});
