import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jasmineFearlessPrincess } from "./178-jasmine-fearless-princess";

const cardToDiscard = createMockCharacter({
  id: "jasmine-fp-discard-target",
  name: "Discard Target",
  cost: 2,
});

const evasiveDefender = createMockCharacter({
  id: "jasmine-fp-evasive-defender",
  name: "Evasive Defender",
  cost: 3,
  strength: 2,
  willpower: 4,
  abilities: [
    {
      id: "jasmine-fp-evasive-defender-kw",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

const nonEvasiveAttacker = createMockCharacter({
  id: "jasmine-fp-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 2,
});

describe("Jasmine - Fearless Princess", () => {
  describe("TAKE THE LEAP — During your turn, this character gains Evasive.", () => {
    it("has Evasive during your own turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jasmineFearlessPrincess, exerted: true }],
          deck: 1,
        },
        {
          play: [nonEvasiveAttacker],
          deck: 1,
        },
      );

      // During player one's turn, Jasmine has Evasive — non-Evasive attacker cannot challenge her
      expect(
        testEngine.asPlayerTwo().canChallenge(nonEvasiveAttacker, jasmineFearlessPrincess),
      ).toBe(false);
    });

    it("loses Evasive during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jasmineFearlessPrincess, exerted: true }],
          deck: 1,
        },
        {
          play: [nonEvasiveAttacker],
          deck: 1,
        },
      );

      // Pass player one's turn; now it is player two's turn
      expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

      // During player two's turn, Jasmine does not have Evasive
      expect(
        testEngine.asPlayerTwo().canChallenge(nonEvasiveAttacker, jasmineFearlessPrincess),
      ).toBe(true);
    });

    it("can challenge Evasive characters during your own turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jasmineFearlessPrincess, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
          deck: 1,
        },
      );

      // Jasmine has Evasive on your turn, so she can challenge the Evasive defender
      expect(testEngine.asPlayerOne().canChallenge(jasmineFearlessPrincess, evasiveDefender)).toBe(
        true,
      );
    });
  });

  describe("NOW'S MY CHANCE — Choose and discard a card — This character gains Challenger +3 this turn.", () => {
    it("does NOT exert Jasmine when activated (regression: spurious exert cost removed)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [cardToDiscard],
        play: [{ card: jasmineFearlessPrincess, isDrying: false }],
        deck: 1,
      });

      const discardId = testEngine.findCardInstanceId(cardToDiscard, "hand", "p1");

      expect(
        testEngine.asPlayerOne().activateAbility(jasmineFearlessPrincess, {
          ability: "NOW'S MY CHANCE",
          costs: {
            discardCards: [discardId],
          },
        }),
      ).toBeSuccessfulCommand();

      // Printed text has no exert cost; Jasmine must remain ready after activating.
      expect(testEngine.asPlayerOne().getCard(jasmineFearlessPrincess).exerted).toBe(false);
    });

    it("gains Challenger +3 this turn after discarding a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [cardToDiscard],
        play: [{ card: jasmineFearlessPrincess, isDrying: false }],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(jasmineFearlessPrincess, "Challenger")).toBe(
        false,
      );

      const discardId = testEngine.findCardInstanceId(cardToDiscard, "hand", "p1");

      expect(
        testEngine.asPlayerOne().activateAbility(jasmineFearlessPrincess, {
          ability: "NOW'S MY CHANCE",
          costs: {
            discardCards: [discardId],
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cardToDiscard)).toBe("discard");
      expect(testEngine.asPlayerOne().getKeywordValue(jasmineFearlessPrincess, "Challenger")).toBe(
        3,
      );
    });

    it("Challenger +3 expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [cardToDiscard],
          play: [{ card: jasmineFearlessPrincess, isDrying: false }],
          deck: 1,
        },
        { deck: 1 },
      );

      const discardId = testEngine.findCardInstanceId(cardToDiscard, "hand", "p1");

      expect(
        testEngine.asPlayerOne().activateAbility(jasmineFearlessPrincess, {
          ability: "NOW'S MY CHANCE",
          costs: {
            discardCards: [discardId],
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getKeywordValue(jasmineFearlessPrincess, "Challenger")).toBe(
        3,
      );

      // Pass both turns
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      // Challenger bonus should have expired
      expect(testEngine.asPlayerOne().hasKeyword(jasmineFearlessPrincess, "Challenger")).toBe(
        false,
      );
    });

    it("cannot activate without discarding a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [],
        play: [{ card: jasmineFearlessPrincess, isDrying: false }],
        deck: 1,
      });

      const result = testEngine.asPlayerOne().activateAbility(jasmineFearlessPrincess, {
        ability: "NOW'S MY CHANCE",
      });

      expect(result.success).toBe(false);
    });
  });
});
