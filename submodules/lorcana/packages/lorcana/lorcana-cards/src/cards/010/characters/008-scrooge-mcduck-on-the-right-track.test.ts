import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { scroogeMcduckOnTheRightTrack } from "./008-scrooge-mcduck-on-the-right-track";

const underCard = createMockCharacter({
  id: "scrooge-under-card",
  name: "Under Card",
  cost: 1,
});

const characterWithCardUnder = createMockCharacter({
  id: "scrooge-character-with-under",
  name: "Character With Card Under",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const characterWithoutCardUnder = createMockCharacter({
  id: "scrooge-character-without-under",
  name: "Character Without Card Under",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Scrooge McDuck - On the Right Track", () => {
  it("should have correct base stats", () => {
    expect(scroogeMcduckOnTheRightTrack.cost).toBe(3);
    expect(scroogeMcduckOnTheRightTrack.strength).toBe(4);
    expect(scroogeMcduckOnTheRightTrack.willpower).toBe(3);
    expect(scroogeMcduckOnTheRightTrack.lore).toBe(1);
  });

  it("should have correct metadata", () => {
    expect(scroogeMcduckOnTheRightTrack.set).toBe("010");
    expect(scroogeMcduckOnTheRightTrack.cardNumber).toBe(8);
    expect(scroogeMcduckOnTheRightTrack.rarity).toBe("uncommon");
    expect(scroogeMcduckOnTheRightTrack.inkable).toBe(true);
    expect(scroogeMcduckOnTheRightTrack.inkType).toEqual(["amber"]);
    expect(scroogeMcduckOnTheRightTrack.classifications).toContain("Storyborn");
    expect(scroogeMcduckOnTheRightTrack.classifications).toContain("Hero");
  });

  describe("FABULOUS WEALTH - When you play this character, chosen character with a card under them gets +1 {L} this turn.", () => {
    it("triggers an optional bag effect when Scrooge is played and there is a character with a card under them", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: scroogeMcduckOnTheRightTrack.cost,
        hand: [scroogeMcduckOnTheRightTrack],
        play: [{ card: characterWithCardUnder, cardsUnder: [underCard] }],
        deck: 1,
      });

      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckOnTheRightTrack),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("gives +1 lore to chosen character with a card under them when accepting the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: scroogeMcduckOnTheRightTrack.cost,
        hand: [scroogeMcduckOnTheRightTrack],
        play: [{ card: characterWithCardUnder, cardsUnder: [underCard] }],
        deck: 1,
      });

      const baseLore = characterWithCardUnder.lore;
      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckOnTheRightTrack),
      ).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckOnTheRightTrack, {
          resolveOptional: true,
          targets: [characterWithCardUnder],
        }),
      ).toBeSuccessfulCommand();

      const targetCard = testEngine.asPlayerOne().getCard(characterWithCardUnder);
      expect(targetCard.lore).toBe(baseLore + 1);
    });

    it("does not give lore bonus when declining the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: scroogeMcduckOnTheRightTrack.cost,
        hand: [scroogeMcduckOnTheRightTrack],
        play: [{ card: characterWithCardUnder, cardsUnder: [underCard] }],
        deck: 1,
      });

      const baseLore = characterWithCardUnder.lore;
      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckOnTheRightTrack),
      ).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckOnTheRightTrack, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      const targetCard = testEngine.asPlayerOne().getCard(characterWithCardUnder);
      expect(targetCard.lore).toBe(baseLore);
    });

    it("lore bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: scroogeMcduckOnTheRightTrack.cost,
        hand: [scroogeMcduckOnTheRightTrack],
        play: [{ card: characterWithCardUnder, cardsUnder: [underCard] }],
        deck: 5,
      });

      const baseLore = characterWithCardUnder.lore;
      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckOnTheRightTrack),
      ).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckOnTheRightTrack, {
          resolveOptional: true,
          targets: [characterWithCardUnder],
        }),
      ).toBeSuccessfulCommand();

      const targetCardBefore = testEngine.asPlayerOne().getCard(characterWithCardUnder);
      expect(targetCardBefore.lore).toBe(baseLore + 1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      const targetCardAfter = testEngine.asPlayerOne().getCard(characterWithCardUnder);
      expect(targetCardAfter.lore).toBe(baseLore);
    });

    it("regression: auto-drains the trigger when no legal target exists", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: scroogeMcduckOnTheRightTrack.cost,
        hand: [scroogeMcduckOnTheRightTrack],
        play: [characterWithoutCardUnder],
        deck: 1,
      });

      const baseLore = characterWithoutCardUnder.lore;
      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckOnTheRightTrack),
      ).toBeSuccessfulCommand();

      // With no legal target, the optional bag entry resolves as a no-op without prompting.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      const targetCard = testEngine.asPlayerOne().getCard(characterWithoutCardUnder);
      expect(targetCard.lore).toBe(baseLore);
    });

    it("can target an opponent's character with a card under them", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: scroogeMcduckOnTheRightTrack.cost,
          hand: [scroogeMcduckOnTheRightTrack],
          deck: 1,
        },
        {
          play: [{ card: characterWithCardUnder, cardsUnder: [underCard] }],
        },
      );

      const baseLore = characterWithCardUnder.lore;
      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckOnTheRightTrack),
      ).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckOnTheRightTrack, {
          resolveOptional: true,
          targets: [characterWithCardUnder],
        }),
      ).toBeSuccessfulCommand();

      const targetCard = testEngine.asPlayerTwo().getCard(characterWithCardUnder);
      expect(targetCard.lore).toBe(baseLore + 1);
    });
  });
});
