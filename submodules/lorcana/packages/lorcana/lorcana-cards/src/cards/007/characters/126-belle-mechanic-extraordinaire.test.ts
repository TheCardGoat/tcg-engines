import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { belleMechanicExtraordinaire } from "./126-belle-mechanic-extraordinaire";

const shiftBase = createMockCharacter({
  id: "belle-shift-base",
  name: "Belle",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const itemA = createMockItem({
  id: "belle-test-item-a",
  name: "Item A",
  cost: 1,
});

const itemB = createMockItem({
  id: "belle-test-item-b",
  name: "Item B",
  cost: 2,
});

const itemC = createMockItem({
  id: "belle-test-item-c",
  name: "Item C",
  cost: 3,
});

describe("Belle - Mechanic Extraordinaire", () => {
  it("has Shift 7", () => {
    const shiftAbility = (belleMechanicExtraordinaire.abilities ?? []).find(
      (a) => a.type === "keyword" && a.keyword === "Shift",
    );
    expect(shiftAbility).toBeDefined();
    expect(shiftAbility!.cost).toEqual({ ink: 7 });
  });

  describe("SALVAGE - For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.", () => {
    it("reduces shift cost by the number of items in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [shiftBase],
        hand: [belleMechanicExtraordinaire],
        discard: [itemA, itemB, itemC],
        // Shift 7 minus 3 items = 4 ink needed
        inkwell: 4,
        deck: 5,
      });

      const shiftTarget = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(belleMechanicExtraordinaire, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(belleMechanicExtraordinaire)).toBe("play");
    });

    it("cannot shift when not enough ink after discount", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [shiftBase],
        hand: [belleMechanicExtraordinaire],
        discard: [itemA, itemB, itemC],
        // Shift 7 minus 3 items = 4 ink needed, but we only have 3
        inkwell: 3,
        deck: 5,
      });

      const shiftTarget = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(belleMechanicExtraordinaire, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).not.toBeSuccessfulCommand();
    });
  });

  describe("REPURPOSE - Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.", () => {
    it("moves 3 items from discard to deck and gains 3 lore plus quest lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: belleMechanicExtraordinaire, isDrying: false }],
        discard: [itemA, itemB, itemC],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(belleMechanicExtraordinaire)).toBeSuccessfulCommand();

      // Should have bag effect for REPURPOSE
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      // Resolve: accept optional, choose all 3 items
      const itemAId = testEngine.findCardInstanceId(itemA, "discard", PLAYER_ONE);
      const itemBId = testEngine.findCardInstanceId(itemB, "discard", PLAYER_ONE);
      const itemCId = testEngine.findCardInstanceId(itemC, "discard", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(belleMechanicExtraordinaire, {
          resolveOptional: true,
          targets: [itemAId, itemBId, itemCId],
        }),
      ).toBeSuccessfulCommand();

      // Items should be in deck (bottom)
      expect(testEngine.asPlayerOne().getCardZone(itemA)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(itemB)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(itemC)).toBe("deck");

      // Lore: 3 (quest) + 3 (one per item moved) = 6
      expect(testEngine.getLore(PLAYER_ONE)).toBe(belleMechanicExtraordinaire.lore + 3);
    });

    it("moves 1 item from discard to deck and gains 1 extra lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: belleMechanicExtraordinaire, isDrying: false }],
        discard: [itemA],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(belleMechanicExtraordinaire)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      // Accept the optional
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(belleMechanicExtraordinaire, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Resolve the pending target selection for put-on-bottom
      const itemAId = testEngine.findCardInstanceId(itemA, "discard", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [itemAId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(itemA)).toBe("deck");
      // Lore: 3 (quest) + 1 (one item moved) = 4
      expect(testEngine.getLore(PLAYER_ONE)).toBe(belleMechanicExtraordinaire.lore + 1);
    });

    // Regression: REPURPOSE was only granting 1 lore regardless of how many items moved (fixed March 15)
    it("regression: moves 2 items from discard to deck and gains exactly 2 extra lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: belleMechanicExtraordinaire, isDrying: false }],
        discard: [itemA, itemB],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(belleMechanicExtraordinaire)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const itemAId = testEngine.findCardInstanceId(itemA, "discard", PLAYER_ONE);
      const itemBId = testEngine.findCardInstanceId(itemB, "discard", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(belleMechanicExtraordinaire, {
          resolveOptional: true,
          targets: [itemAId, itemBId],
        }),
      ).toBeSuccessfulCommand();

      // Items should be in deck
      expect(testEngine.asPlayerOne().getCardZone(itemA)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(itemB)).toBe("deck");

      // Lore: 3 (quest) + 2 (one per item moved) = 5 — NOT quest + 1
      expect(testEngine.getLore(PLAYER_ONE)).toBe(belleMechanicExtraordinaire.lore + 2);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: belleMechanicExtraordinaire, isDrying: false }],
        discard: [itemA, itemB],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(belleMechanicExtraordinaire)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(belleMechanicExtraordinaire, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Items should still be in discard
      expect(testEngine.asPlayerOne().getCardZone(itemA)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(itemB)).toBe("discard");

      // Only quest lore
      expect(testEngine.getLore(PLAYER_ONE)).toBe(belleMechanicExtraordinaire.lore);
    });
  });
});
