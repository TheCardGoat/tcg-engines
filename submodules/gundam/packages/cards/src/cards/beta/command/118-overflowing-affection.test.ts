import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  createMockUnit,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { betaOverflowingAffection118 } from "./118-overflowing-affection.ts";

describe("Overflowing Affection (GD01-118, beta reprint)", () => {
  describe("【Main】Draw 2. Then, discard 1.", () => {
    it("draws 2, then asks which card from the updated hand to discard", () => {
      const discardOption = createMockUnit({ name: "Discard Option" });
      const engine = GundamTestEngine.create({
        hand: [betaOverflowingAffection118, discardOption],
        resourceArea: activeResources(3),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [commandId, discardOptionId] = p1.getHand();

      expectSuccess(p1.playCommand(betaOverflowingAffection118));
      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.arrayContaining([discardOptionId]),
        minTargets: 1,
        maxTargets: 1,
      });
      if (choice?.kind !== "targetSelection") {
        throw new Error(
          "Expected Overflowing Affection to ask which card to discard after drawing",
        );
      }
      expect(choice.legalTargetIds).toHaveLength(3);
      expectSuccess(p1.resolveEffect({ targets: [discardOptionId!] }));

      expect(p1.getCardZone(discardOptionId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(2);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
      expectCardInTrash(engine, commandId!, p1.playerId);
    });
  });
});
