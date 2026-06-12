import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  isCardExhausted,
} from "@tcg/gundam-engine";
import { gd04Kapool074 } from "./074-kapool.ts";

describe("Kapool (GD04-074)", () => {
  describe("【Attack】You may pay ①. If you do, draw 1. Then, discard 1.", () => {
    it("may pay 1 resource on attack to draw 1 then discard 1", () => {
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
      const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
      const handBefore = p1.getHand().length;
      const trashBefore = p1.getCardsInZone("trash").length;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

      expect(isCardExhausted(engine, resourceId)).toBe(true);
      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
      expect(p1.getHand().length).toBe(handBefore);
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
      const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
      const handBefore = p1.getHand().length;
      const trashBefore = p1.getCardsInZone("trash").length;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

      expect(isCardExhausted(engine, resourceId)).toBe(false);
      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
      expect(p1.getHand().length).toBe(handBefore);
      expect(p1.getCardsInZone("trash").length).toBe(trashBefore);
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
      const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
      const handBefore = p1.getHand().length;
      const trashBefore = p1.getCardsInZone("trash").length;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
      expect(p1.getHand().length).toBe(handBefore);
      expect(p1.getCardsInZone("trash").length).toBe(trashBefore);
    });
  });
});
