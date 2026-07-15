import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { monstroInfamousWhale, donaldDuckCoinCollector } from "@tcg/lorcana-cards/cards/008";
import { theGreatIlluminaryAbandonedLaboratory } from "@tcg/lorcana-cards/cards/010";

const deckFiller = createMockCharacter({
  id: "combo-deck-filler",
  name: "Deck Filler",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Monstro Combo Shortcut — FULL BREACH + exert-to-draw loop", () => {
  describe("with Donald Duck - Coin Collector (MONEY EVERYWHERE)", () => {
    it("combo draws entire deck after playing Donald Duck", () => {
      const deckSize = 10;
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckCoinCollector],
        play: [monstroInfamousWhale],
        inkwell: donaldDuckCoinCollector.cost,
        deck: deckSize,
      });

      // Play Donald Duck to grant MONEY EVERYWHERE to Monstro
      expect(testEngine.asPlayerOne().playCard(donaldDuckCoinCollector)).toBeSuccessfulCommand();

      // Activate the combo shortcut (abilityIndex 1 = FULL BREACH + COMBO)
      expect(
        testEngine.asPlayerOne().activateAbility(monstroInfamousWhale, { abilityIndex: 1 }),
      ).toBeSuccessfulCommand();

      // Deck should be empty — all cards were drawn
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
    });

    it("combo creates a pending discard selection for the same number of cards drawn", () => {
      const deckSize = 5;
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckCoinCollector],
        play: [monstroInfamousWhale],
        inkwell: donaldDuckCoinCollector.cost,
        deck: deckSize,
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckCoinCollector)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().activateAbility(monstroInfamousWhale, { abilityIndex: 1 }),
      ).toBeSuccessfulCommand();

      // A pending discard selection should exist
      const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
      expect(pendingEffects.length).toBeGreaterThan(0);

      // The pending effect should be a discard selection
      const discardPending = pendingEffects[0]!;
      expect(discardPending.selectionContext).toBeDefined();
      expect(discardPending.selectionContext?.kind).toBe("discard-choice");
    });

    it("combo is not available without the grant", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [monstroInfamousWhale],
        deck: 5,
      });

      // Should fail — no exert-to-draw ability granted
      const result = testEngine
        .asPlayerOne()
        .activateAbility(monstroInfamousWhale, { abilityIndex: 1 });
      expect(result.success).toBe(false);
    });

    it("combo is not available next turn (MONEY EVERYWHERE is this-turn only)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [donaldDuckCoinCollector],
        play: [monstroInfamousWhale],
        inkwell: donaldDuckCoinCollector.cost,
        deck: 10,
      });

      expect(testEngine.asPlayerOne().playCard(donaldDuckCoinCollector)).toBeSuccessfulCommand();

      // Pass both turns without using the combo
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Combo should no longer be available
      const result = testEngine
        .asPlayerOne()
        .activateAbility(monstroInfamousWhale, { abilityIndex: 1 });
      expect(result.success).toBe(false);
    });
  });

  describe("with The Great Illuminary - Abandoned Laboratory (STARTLING DISCOVERY)", () => {
    it("combo is available when Monstro is at the Great Illuminary", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          theGreatIlluminaryAbandonedLaboratory,
          { card: monstroInfamousWhale, atLocation: theGreatIlluminaryAbandonedLaboratory },
        ],
        deck: 5,
      });

      // Monstro is at the Great Illuminary, so it has the STARTLING DISCOVERY ability
      // The combo shortcut should be available
      const result = testEngine
        .asPlayerOne()
        .activateAbility(monstroInfamousWhale, { abilityIndex: 1 });
      expect(result.success).toBe(true);

      // Deck should be empty
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
    });

    it("combo is NOT available when Monstro is not at the location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [theGreatIlluminaryAbandonedLaboratory, monstroInfamousWhale],
        deck: 5,
      });

      // Monstro is NOT at the location, so no STARTLING DISCOVERY
      const result = testEngine
        .asPlayerOne()
        .activateAbility(monstroInfamousWhale, { abilityIndex: 1 });
      expect(result.success).toBe(false);
    });
  });
});
