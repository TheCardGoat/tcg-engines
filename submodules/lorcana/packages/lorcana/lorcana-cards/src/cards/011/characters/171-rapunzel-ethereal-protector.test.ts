import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rapunzelEtherealProtector } from "./171-rapunzel-ethereal-protector";

const cardUnderRapunzel = createMockCharacter({
  id: "rapunzel-ethereal-protector-under-card",
  name: "Under Card",
  cost: 1,
});

const opposingCharacter = createMockCharacter({
  id: "rapunzel-ethereal-protector-opponent",
  name: "Opposing Character",
  cost: 3,
  strength: 2,
  willpower: 4,
});

const exertedTarget = createMockCharacter({
  id: "rapunzel-ethereal-protector-exerted-target",
  name: "Exerted Target",
  cost: 2,
  strength: 1,
  willpower: 1,
});

describe("Rapunzel - Ethereal Protector", () => {
  it("should quest for base lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: rapunzelEtherealProtector, isDrying: false }],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(rapunzelEtherealProtector)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(rapunzelEtherealProtector.lore);
  });

  it("should have Boost 2 keyword ability", () => {
    const boostAbility = rapunzelEtherealProtector.abilities?.find(
      (a) => a.type === "keyword" && "keyword" in a && a.keyword === "Boost",
    );
    expect(boostAbility).toBeDefined();
  });

  describe("CLONK! - Whenever this character quests, if there's a card under her, chosen opposing character can't challenge until the start of your next turn", () => {
    it("CLONK! triggers when questing with a card under her and applies cant-challenge to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            {
              card: rapunzelEtherealProtector,
              isDrying: false,
              cardsUnder: [cardUnderRapunzel],
            },
            { card: exertedTarget, exerted: true },
          ],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(rapunzelEtherealProtector)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rapunzelEtherealProtector, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(true);
      expect(
        testEngine.asPlayerTwo().challenge(opposingCharacter, exertedTarget),
      ).not.toBeSuccessfulCommand();
    });

    it("CLONK! does not trigger when questing without a card under her", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rapunzelEtherealProtector, isDrying: false }],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(rapunzelEtherealProtector)).toBeSuccessfulCommand();
      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(false);
    });

    it("CLONK! restriction expires at the start of Rapunzel controller's next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            {
              card: rapunzelEtherealProtector,
              isDrying: false,
              cardsUnder: [cardUnderRapunzel],
            },
          ],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(rapunzelEtherealProtector)).toBeSuccessfulCommand();
      testEngine.asPlayerOne().resolvePendingByCard(rapunzelEtherealProtector, {
        targets: [opposingCharacter],
      });

      // Pass both turns
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(true);
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // At start of player one's next turn, restriction should be gone
      expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(false);
    });

    it("regression: only prevents the CHOSEN opposing character from challenging, not ALL opposing characters", () => {
      const otherOpposingCharacter = createMockCharacter({
        id: "rapunzel-ethereal-protector-other-opponent",
        name: "Other Opposing Character",
        cost: 3,
        strength: 2,
        willpower: 4,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            {
              card: rapunzelEtherealProtector,
              isDrying: false,
              cardsUnder: [cardUnderRapunzel],
            },
            { card: exertedTarget, exerted: true },
          ],
          deck: 5,
        },
        {
          play: [opposingCharacter, otherOpposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(rapunzelEtherealProtector)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rapunzelEtherealProtector, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Only the chosen opposing character should have cant-challenge
      expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(true);
      // The other opposing character should NOT be restricted
      expect(testEngine.hasRestriction(otherOpposingCharacter, "cant-challenge")).toBe(false);
    });

    it("regression: CLONK! should prevent challenge until the start of your next turn, not just until end of turn", () => {
      // Bug: Rapunzel's CLONK! was not preventing challenge until next turn.
      // The restriction should persist through opponent's turn until the start of Rapunzel controller's next turn.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            {
              card: rapunzelEtherealProtector,
              isDrying: false,
              cardsUnder: [cardUnderRapunzel],
            },
            { card: exertedTarget, exerted: true },
          ],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(rapunzelEtherealProtector)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rapunzelEtherealProtector, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Pass to opponent's turn - restriction should still be active
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(true);

      // Opponent should not be able to challenge
      expect(
        testEngine.asPlayerTwo().challenge(opposingCharacter, exertedTarget),
      ).not.toBeSuccessfulCommand();
    });
  });
});
