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
import { st04StrikeGundam002 } from "./002-strike-gundam.ts";

describe("Strike Gundam (ST04-002)", () => {
  describe("Printed Lv.4 and cost 2", () => {
    it("deploys from hand to the battle area and rests exactly 2 Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikeGundam002],
        resourceArea: activeResources(4),
        deck: 2,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const strikeId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(strikeId));

      expect(p1.getCardZone(strikeId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("stays in hand below its printed Lv.4 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikeGundam002],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const strikeId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(strikeId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getCardZone(strikeId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("stays in hand when a legal deployment leaves only 1 active Resource", () => {
      const spender = createMockUnit({ name: "Resource Spender", level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, st04StrikeGundam002],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [spenderId, strikeId] = p1.getHand();

      expectSuccess(p1.deployUnit(spenderId!));
      expectFailure(p1.deployUnit(strikeId!), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(strikeId!)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be deployed during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikeGundam002],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const strikeId = p1.getHand()[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.deployUnit(strikeId), "WRONG_PHASE");

      expect(p1.getCardZone(strikeId)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Deploy】Draw 1. Then, discard 1.", () => {
    it("offers both the existing and newly drawn hand cards to its controller", () => {
      const existingCard = createMockUnit({ name: "Existing Card" });
      const drawnCard = createMockUnit({ name: "Drawn Card" });
      const remainingDeckCard = createMockUnit({ name: "Remaining Deck Card" });
      const engine = GundamTestEngine.create({
        hand: [st04StrikeGundam002, existingCard],
        resourceArea: activeResources(4),
        deck: [remainingDeckCard, drawnCard],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [strikeId, existingCardId] = p1.getHand();

      expectSuccess(p1.deployUnit(strikeId!));

      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.arrayContaining([existingCardId]),
        minTargets: 1,
        maxTargets: 1,
        controllerId: PLAYER_ONE,
      });
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected Strike Gundam's controller to choose the discard");
      }
      expect(choice.legalTargetIds).toHaveLength(2);
      expect(p1.getCardZone(strikeId!)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("can discard the card that was already in hand", () => {
      const existingCard = createMockUnit({ name: "Existing Card" });
      const drawnCard = createMockUnit({ name: "Drawn Card" });
      const remainingDeckCard = createMockUnit({ name: "Remaining Deck Card" });
      const engine = GundamTestEngine.create({
        hand: [st04StrikeGundam002, existingCard],
        resourceArea: activeResources(4),
        deck: [remainingDeckCard, drawnCard],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const existingCardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(st04StrikeGundam002));
      expectSuccess(p1.resolveEffect({ targets: [existingCardId] }));

      expect(p1.getCardZone(existingCardId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(1);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    });

    it("can discard the newly drawn card", () => {
      const existingCard = createMockUnit({ name: "Existing Card" });
      const drawnCard = createMockUnit({ name: "Drawn Card" });
      const remainingDeckCard = createMockUnit({ name: "Remaining Deck Card" });
      const engine = GundamTestEngine.create({
        hand: [st04StrikeGundam002, existingCard],
        resourceArea: activeResources(4),
        deck: [remainingDeckCard, drawnCard],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const existingCardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(st04StrikeGundam002));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected the post-draw discard selection");
      }
      const drawnCardId = choice.legalTargetIds.find((id) => id !== existingCardId);
      if (!drawnCardId)
        throw new Error("Expected the newly drawn card to be visible in the prompt");
      expectSuccess(p1.resolveEffect({ targets: [drawnCardId] }));

      expect(p1.getCardZone(drawnCardId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(existingCardId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("requires exactly 1 discard selection", () => {
      const existingCard = createMockUnit({ name: "Existing Card" });
      const drawnCard = createMockUnit({ name: "Drawn Card" });
      const remainingDeckCard = createMockUnit({ name: "Remaining Deck Card" });
      const engine = GundamTestEngine.create({
        hand: [st04StrikeGundam002, existingCard],
        resourceArea: activeResources(4),
        deck: [remainingDeckCard, drawnCard],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(st04StrikeGundam002));
      expectFailure(p1.resolveEffect({ targets: [] }), "WRONG_TARGET_COUNT");

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        minTargets: 1,
        maxTargets: 1,
      });
    });
  });
});
