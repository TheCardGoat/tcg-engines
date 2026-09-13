import { describe, expect, it } from "vite-plus/test";
import { createMockBase, expectSuccess, GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { exbpExBase025 } from "./025-ex-base.ts";

describe("EX Base (EXBP-025)", () => {
  describe("(At the start of the game, place 1 active EX Base as your shield area's base.)", () => {
    it("is active in the base section and ceases to exist instead of entering trash when replaced", () => {
      const replacement = createMockBase({ name: "Replacement Base", level: 0, cost: 0 });
      const engine = GundamTestEngine.create({
        hand: [replacement],
        baseSection: [{ card: exbpExBase025, isToken: true }],
      });
      const player = engine.asPlayer(PLAYER_ONE);
      const exBaseId = player.getCardsInZone("baseSection")[0]!;
      const trashBefore = player.getBoardView().players[PLAYER_ONE]!.trashCount;

      expect(player.isExhausted(exBaseId)).toBe(false);
      expectSuccess(player.deployBase(replacement));
      expect(player.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [exBaseId],
      });
      expectSuccess(player.resolveEffect({ targets: [exBaseId] }));

      expect(player.getCardZone(exBaseId)).toBeUndefined();
      expect(player.getCardsInZone("baseSection")).toHaveLength(1);
      expect(player.getBoardView().players[PLAYER_ONE]!.trashCount).toBe(trashBefore);
    });
  });
});
