import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st08LaneAim011 } from "../../st08/pilot/011-lane-aim.ts";
import { gd04Kapool074 } from "./074-kapool.ts";

describe("Kapool (GD04-074)", () => {
  describe("【Attack】You may pay ①. If you do, draw 1. Then, discard 1.", () => {
    it("lets the player discard either an existing card or the newly drawn card", () => {
      const defender = { card: createMockUnit({ ap: 1, hp: 5 }), exhausted: true };
      const engine = GundamTestEngine.create(
        {
          play: [gd04Kapool074],
          hand: [createMockUnit({ name: "Discard Fodder" })],
          deck: 5,
          resourceArea: activeResources(1),
        },
        { play: [defender] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const resourceId = p1.getCardsInZone("resourceArea")[0]!;
      const existingHandCardId = p1.getHand()[0]!;
      const deckBefore = p1.getCardsInZone("deck").length;
      const trashBefore = p1.getCardsInZone("trash").length;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expect(p1.getBoardView().pendingChoice?.kind).toBe("optional");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

      const drawnCardId = p1.getHand().find((cardId) => cardId !== existingHandCardId)!;
      const discardChoice = p1.getBoardView().pendingChoice;
      expect(discardChoice?.kind).toBe("targetSelection");
      if (discardChoice?.kind !== "targetSelection") {
        throw new Error("Expected a discard target selection");
      }
      expect(discardChoice.legalTargetIds).toEqual(
        expect.arrayContaining([existingHandCardId, drawnCardId]),
      );

      expectSuccess(p1.resolveEffect({ targets: [drawnCardId] }));

      expect(p1.isExhausted(resourceId)).toBe(true);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore - 1);
      expect(p1.getHand()).toEqual([existingHandCardId]);
      expect(p1.getCardZone(drawnCardId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("trash").length).toBe(trashBefore + 1);
    });

    it("declining the payment skips both draw and discard", () => {
      const defender = { card: createMockUnit({ ap: 1, hp: 5 }), exhausted: true };
      const engine = GundamTestEngine.create(
        {
          play: [gd04Kapool074],
          hand: [createMockUnit({ name: "Hand Card" })],
          deck: 5,
          resourceArea: activeResources(1),
        },
        { play: [defender] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const resourceId = p1.getCardsInZone("resourceArea")[0]!;
      const deckBefore = p1.getCardsInZone("deck").length;
      const handBefore = p1.getHand().length;
      const trashBefore = p1.getCardsInZone("trash").length;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expect(p1.getBoardView().pendingChoice?.kind).toBe("optional");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

      expect(p1.isExhausted(resourceId)).toBe(false);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
      expect(p1.getHand().length).toBe(handBefore);
      expect(p1.getCardsInZone("trash").length).toBe(trashBefore);
    });

    it("ends the game without a discard prompt or draw trigger after drawing the last card", () => {
      const blueHost = createMockUnit({ name: "Blue Host", color: "blue", ap: 2, hp: 4 });
      const defender = { card: createMockUnit({ ap: 1, hp: 5 }), exhausted: true };
      const engine = GundamTestEngine.create(
        {
          hand: [st08LaneAim011],
          play: [gd04Kapool074, blueHost],
          deck: 1,
          resourceArea: activeResources(4),
        },
        { play: [defender] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [attackerId, blueHostId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st08LaneAim011, blueHostId!));
      expectSuccess(p1.enterBattle(attackerId!, defenderId));
      expect(p1.getBoardView().pendingChoice?.kind).toBe("optional");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

      expect(p1.getBoardView().winner).toBe(PLAYER_TWO);
      expect(p1.getCardsInZone("deck")).toHaveLength(0);
      expect(p1.getHand()).toHaveLength(1);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getVisibleCard(blueHostId!)?.keywords).not.toContain("HighManeuver");
    });

    it("cannot pay from rested resources, so the dependent draw and discard are skipped", () => {
      const defender = { card: createMockUnit({ ap: 1, hp: 5 }), exhausted: true };
      const engine = GundamTestEngine.create(
        {
          play: [gd04Kapool074],
          hand: [createMockUnit({ name: "Hand Card" })],
          deck: 5,
          resourceArea: activeResources(1).map((entry) => ({ ...entry, exhausted: true })),
        },
        { play: [defender] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getCardsInZone("deck").length;
      const handBefore = p1.getHand().length;
      const trashBefore = p1.getCardsInZone("trash").length;

      expectSuccess(p1.enterBattle(attackerId, defenderId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
      expect(p1.getHand().length).toBe(handBefore);
      expect(p1.getCardsInZone("trash").length).toBe(trashBefore);
    });
  });
});
