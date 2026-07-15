import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { princePhillipVanquisherOfFoes } from "./073-prince-phillip-vanquisher-of-foes";

const damagedOpponent = createMockCharacter({
  id: "ppvof-damaged-opponent",
  name: "Damaged Opponent",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const undamagedOpponent = createMockCharacter({
  id: "ppvof-undamaged-opponent",
  name: "Undamaged Opponent",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const anotherDamagedOpponent = createMockCharacter({
  id: "ppvof-another-damaged-opponent",
  name: "Another Damaged Opponent",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Prince Phillip - Vanquisher of Foes", () => {
  describe("Shift 6", () => {
    it("has Shift keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [princePhillipVanquisherOfFoes],
      });

      const cardUnderTest = testEngine.getCardModel(princePhillipVanquisherOfFoes);
      expect(cardUnderTest.hasShift()).toBe(true);
      expect(cardUnderTest.shiftInkCost).toBe(6);
    });
  });

  describe("Evasive", () => {
    it("has Evasive keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [princePhillipVanquisherOfFoes],
      });

      const cardUnderTest = testEngine.getCardModel(princePhillipVanquisherOfFoes);
      expect(cardUnderTest.hasEvasive).toBe(true);
    });
  });

  describe("SWIFT AND SURE - When you play this character, banish all opposing damaged characters.", () => {
    it("banishes all opposing damaged characters when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [princePhillipVanquisherOfFoes],
          inkwell: princePhillipVanquisherOfFoes.cost,
          deck: 2,
        },
        {
          play: [
            { card: damagedOpponent, damage: 2 },
            { card: anotherDamagedOpponent, damage: 1 },
          ],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(princePhillipVanquisherOfFoes),
      ).toBeSuccessfulCommand();

      // Both damaged opponents should be banished
      expect(testEngine.asPlayerTwo().getCardZone(damagedOpponent)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(anotherDamagedOpponent)).toBe("discard");
    });

    it("does NOT banish undamaged opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [princePhillipVanquisherOfFoes],
          inkwell: princePhillipVanquisherOfFoes.cost,
          deck: 2,
        },
        {
          play: [undamagedOpponent],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(princePhillipVanquisherOfFoes),
      ).toBeSuccessfulCommand();

      // Undamaged opponent should remain in play
      expect(testEngine.asPlayerTwo().getCardZone(undamagedOpponent)).toBe("play");
    });

    it("banishes damaged opponents but leaves undamaged opponents in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [princePhillipVanquisherOfFoes],
          inkwell: princePhillipVanquisherOfFoes.cost,
          deck: 2,
        },
        {
          play: [{ card: damagedOpponent, damage: 3 }, undamagedOpponent],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(princePhillipVanquisherOfFoes),
      ).toBeSuccessfulCommand();

      // Damaged opponent is banished
      expect(testEngine.asPlayerTwo().getCardZone(damagedOpponent)).toBe("discard");
      // Undamaged opponent stays in play
      expect(testEngine.asPlayerTwo().getCardZone(undamagedOpponent)).toBe("play");
    });

    it("does NOT banish the player's own damaged characters", () => {
      const ownDamagedCharacter = createMockCharacter({
        id: "ppvof-own-damaged",
        name: "Own Damaged",
        cost: 2,
        strength: 2,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [princePhillipVanquisherOfFoes],
          inkwell: princePhillipVanquisherOfFoes.cost,
          play: [{ card: ownDamagedCharacter, damage: 2 }],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(princePhillipVanquisherOfFoes),
      ).toBeSuccessfulCommand();

      // Own damaged character should NOT be banished
      expect(testEngine.asPlayerOne().getCardZone(ownDamagedCharacter)).toBe("play");
    });
  });
});
