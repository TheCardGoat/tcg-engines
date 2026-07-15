import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { princePhillipVanquisherOfFoes } from "./087-prince-phillip-vanquisher-of-foes";

const damagedOpponent1 = createMockCharacter({
  id: "ppvof-damaged-opp-1",
  name: "Damaged Opponent 1",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const damagedOpponent2 = createMockCharacter({
  id: "ppvof-damaged-opp-2",
  name: "Damaged Opponent 2",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const undamagedOpponent = createMockCharacter({
  id: "ppvof-undamaged-opp",
  name: "Undamaged Opponent",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const ownDamagedChar = createMockCharacter({
  id: "ppvof-own-damaged",
  name: "Own Damaged Char",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Prince Phillip - Vanquisher of Foes", () => {
  it("has Shift 6 and Evasive keywords", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [princePhillipVanquisherOfFoes],
    });

    expect(testEngine.asPlayerOne().hasKeyword(princePhillipVanquisherOfFoes, "Evasive")).toBe(
      true,
    );

    const shiftAbility = princePhillipVanquisherOfFoes.abilities?.find(
      (a) => a.type === "keyword" && "keyword" in a && a.keyword === "Shift",
    );
    expect(shiftAbility).toBeDefined();
    expect((shiftAbility as { cost: { ink: number } }).cost?.ink).toBe(6);
  });

  describe("SWIFT AND SURE: When you play this character, banish all opposing damaged characters.", () => {
    it("banishes all opposing damaged characters when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [princePhillipVanquisherOfFoes],
          inkwell: princePhillipVanquisherOfFoes.cost,
          deck: 1,
        },
        {
          play: [
            { card: damagedOpponent1, damage: 1 },
            { card: damagedOpponent2, damage: 2 },
            undamagedOpponent,
          ],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(princePhillipVanquisherOfFoes),
      ).toBeSuccessfulCommand();

      // Both damaged opposing characters should be banished
      expect(testEngine.asPlayerTwo().getCardZone(damagedOpponent1)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(damagedOpponent2)).toBe("discard");
    });

    it("does NOT banish undamaged opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [princePhillipVanquisherOfFoes],
          inkwell: princePhillipVanquisherOfFoes.cost,
          deck: 1,
        },
        {
          play: [{ card: damagedOpponent1, damage: 1 }, undamagedOpponent],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(princePhillipVanquisherOfFoes),
      ).toBeSuccessfulCommand();

      // Damaged opponent is banished
      expect(testEngine.asPlayerTwo().getCardZone(damagedOpponent1)).toBe("discard");

      // Undamaged opponent survives
      expect(testEngine.asPlayerTwo().getCardZone(undamagedOpponent)).toBe("play");
    });

    it("does NOT banish your own damaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [princePhillipVanquisherOfFoes],
          inkwell: princePhillipVanquisherOfFoes.cost,
          play: [{ card: ownDamagedChar, damage: 2 }],
          deck: 1,
        },
        {
          play: [{ card: damagedOpponent1, damage: 1 }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(princePhillipVanquisherOfFoes),
      ).toBeSuccessfulCommand();

      // Own damaged character should NOT be banished
      expect(testEngine.asPlayerOne().getCardZone(ownDamagedChar)).toBe("play");

      // Opposing damaged character is banished
      expect(testEngine.asPlayerTwo().getCardZone(damagedOpponent1)).toBe("discard");
    });
  });
});
