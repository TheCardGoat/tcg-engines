import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { donaldDuckBuccaneer } from "./179-donald-duck-buccaneer";

const fragileOpponent = createMockCharacter({
  id: "donald-buccaneer-fragile-opponent",
  name: "Fragile Opponent",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const allyCharacter = createMockCharacter({
  id: "donald-buccaneer-ally",
  name: "Ally Character",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 2,
});

const anotherAlly = createMockCharacter({
  id: "donald-buccaneer-another-ally",
  name: "Another Ally",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const survivingOpponent = createMockCharacter({
  id: "donald-buccaneer-surviving-opponent",
  name: "Surviving Opponent",
  cost: 5,
  strength: 3,
  willpower: 10,
  lore: 2,
});

describe("Donald Duck - Buccaneer", () => {
  describe("BOARDING PARTY — During your turn, whenever this character banishes a character in a challenge, your other characters get +1 lore this turn.", () => {
    it("other friendly characters get +1 lore when Donald banishes a character in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckBuccaneer, allyCharacter, anotherAlly],
          deck: 1,
        },
        {
          play: [{ card: fragileOpponent, exerted: true }],
          deck: 1,
        },
      );

      const allyLoreBefore = testEngine.asPlayerOne().getCardLore(allyCharacter);
      const anotherAllyLoreBefore = testEngine.asPlayerOne().getCardLore(anotherAlly);

      expect(
        testEngine.asPlayerOne().challenge(donaldDuckBuccaneer, fragileOpponent),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(fragileOpponent)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardLore(allyCharacter)).toBe(allyLoreBefore + 1);
      expect(testEngine.asPlayerOne().getCardLore(anotherAlly)).toBe(anotherAllyLoreBefore + 1);
    });

    it("Donald Duck himself does NOT get the lore bonus", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckBuccaneer],
          deck: 1,
        },
        {
          play: [{ card: fragileOpponent, exerted: true }],
          deck: 1,
        },
      );

      const donaldLoreBefore = testEngine.asPlayerOne().getCardLore(donaldDuckBuccaneer);

      expect(
        testEngine.asPlayerOne().challenge(donaldDuckBuccaneer, fragileOpponent),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(fragileOpponent)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardLore(donaldDuckBuccaneer)).toBe(donaldLoreBefore);
    });

    it("opponent's characters do NOT get the lore bonus", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckBuccaneer],
          deck: 1,
        },
        {
          play: [{ card: fragileOpponent, exerted: true }, survivingOpponent],
          deck: 1,
        },
      );

      const survivingLoreBefore = testEngine.asPlayerTwo().getCardLore(survivingOpponent);

      expect(
        testEngine.asPlayerOne().challenge(donaldDuckBuccaneer, fragileOpponent),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(fragileOpponent)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardLore(survivingOpponent)).toBe(survivingLoreBefore);
    });

    it("does NOT trigger during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: donaldDuckBuccaneer, exerted: true }, allyCharacter],
          deck: 1,
        },
        {
          play: [fragileOpponent],
          deck: 1,
        },
      );

      testEngine.asPlayerOne().passTurn();

      const allyLoreBefore = testEngine.asPlayerOne().getCardLore(allyCharacter);

      // Opponent challenges Donald (exerted)
      expect(
        testEngine.asPlayerTwo().challenge(fragileOpponent, donaldDuckBuccaneer),
      ).toBeSuccessfulCommand();

      // allyCharacter should NOT gain lore because it's opponent's turn
      expect(testEngine.asPlayerOne().getCardLore(allyCharacter)).toBe(allyLoreBefore);
    });

    it("does NOT trigger if the challenge does not banish the opponent", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckBuccaneer, allyCharacter],
          deck: 1,
        },
        {
          play: [{ card: survivingOpponent, exerted: true }],
          deck: 1,
        },
      );

      const allyLoreBefore = testEngine.asPlayerOne().getCardLore(allyCharacter);

      expect(
        testEngine.asPlayerOne().challenge(donaldDuckBuccaneer, survivingOpponent),
      ).toBeSuccessfulCommand();

      // survivingOpponent survived, so BOARDING PARTY should not trigger
      expect(testEngine.asPlayerOne().getCardZone(survivingOpponent)).toBe("play");
      expect(testEngine.asPlayerOne().getCardLore(allyCharacter)).toBe(allyLoreBefore);
    });
  });
});
