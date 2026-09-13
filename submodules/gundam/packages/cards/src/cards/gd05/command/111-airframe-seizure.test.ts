import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd05AirframeSeizure111 } from "./111-airframe-seizure.ts";

describe("Airframe​ Seizure (GD05-111)", () => {
  /** @behavioral-proof complete: Main timing, exact discard choice, dependent draw, no-discard branch, and resource-cost gate are public. */
  describe("【Main】Discard 1. If you do, draw 2.", () => {
    it("discards the chosen hand card before drawing exactly 2 cards", () => {
      const discardFodder = createMockUnit({ name: "Discard Fodder" });
      const engine = GundamTestEngine.create({
        hand: [gd05AirframeSeizure111, discardFodder],
        resourceArea: activeResources(1),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [commandId, discardFodderId] = p1.getHand();

      expectSuccess(p1.playCommand(commandId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [discardFodderId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [discardFodderId!] }));

      expect(p1.getCardZone(discardFodderId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(commandId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getHand()).toHaveLength(2);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    });

    it("does not draw when no other hand card can be discarded", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05AirframeSeizure111],
        resourceArea: activeResources(1),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getHand()).toHaveLength(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(5);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05AirframeSeizure111],
        resourceArea: restedResources(1),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(gd05AirframeSeizure111),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });
});
