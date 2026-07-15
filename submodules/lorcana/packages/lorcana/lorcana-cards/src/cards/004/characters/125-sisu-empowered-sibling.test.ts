import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sisuEmpoweredSibling } from "./125-sisu-empowered-sibling";
import { tongSurvivor } from "./126-tong-survivor";
import { iceBlock } from "../items/168-ice-block";

const weakOpponent1 = createMockCharacter({
  id: "sisu-weak-opp-1",
  name: "Weak Opponent 1",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const weakOpponent2 = createMockCharacter({
  id: "sisu-weak-opp-2",
  name: "Weak Opponent 2",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const strongOpponentCard = createMockCharacter({
  id: "sisu-strong-opp",
  name: "Strong Opponent",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const ownWeakChar = createMockCharacter({
  id: "sisu-own-weak",
  name: "Own Weak Char",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Sisu - Empowered Sibling", () => {
  it("has correct stats", () => {
    expect(sisuEmpoweredSibling.cost).toBe(8);
    expect(sisuEmpoweredSibling.strength).toBe(5);
    expect(sisuEmpoweredSibling.willpower).toBe(4);
    expect(sisuEmpoweredSibling.lore).toBe(3);
    expect(sisuEmpoweredSibling.inkable).toBe(false);
  });

  it("has Shift 6 keyword", () => {
    const shiftAbility = (sisuEmpoweredSibling.abilities ?? []).find(
      (a) => a.type === "keyword" && "keyword" in a && a.keyword === "Shift",
    );
    expect(shiftAbility).toBeDefined();
  });

  describe("I GOT THIS! — When you play this character, banish all opposing characters with 2 {S} or less.", () => {
    it("banishes all opposing characters with 2 strength or less when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sisuEmpoweredSibling],
          inkwell: sisuEmpoweredSibling.cost,
          play: [ownWeakChar],
          deck: 1,
        },
        {
          play: [weakOpponent1, weakOpponent2, strongOpponentCard],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(sisuEmpoweredSibling)).toBeSuccessfulCommand();

      // Player one's weak character should be unaffected
      expect(testEngine.asPlayerOne().getCardZone(ownWeakChar)).toBe("play");

      // Opposing characters with 2 strength or less are banished
      expect(testEngine.asPlayerOne().getCardZone(weakOpponent1)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(weakOpponent2)).toBe("discard");

      // Opposing character with 3 strength survives
      expect(testEngine.asPlayerOne().getCardZone(strongOpponentCard)).toBe("play");
    });

    it("does not banish opposing characters with more than 2 strength", () => {
      const strongOpponent = createMockCharacter({
        id: "sisu-strong-opponent",
        name: "Strong Opponent",
        cost: 3,
        strength: 3,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sisuEmpoweredSibling],
          inkwell: sisuEmpoweredSibling.cost,
          deck: 1,
        },
        {
          play: [strongOpponent],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(sisuEmpoweredSibling)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(strongOpponent)).toBe("play");
    });

    it("does not banish your own characters with 2 strength or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sisuEmpoweredSibling],
          inkwell: sisuEmpoweredSibling.cost,
          play: [ownWeakChar],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(sisuEmpoweredSibling)).toBeSuccessfulCommand();

      // Player one's own weak character should not be banished
      expect(testEngine.asPlayerOne().getCardZone(ownWeakChar)).toBe("play");
    });
  });
});

describe("Regression", () => {
  it("should combo correctly with Ice Block — a character debuffed to 2 strength or less gets banished", () => {
    // tongSurvivor has strength=3, which is above 2
    // iceBlock gives -1 strength this turn, bringing Tong to 2 strength
    // When Sisu is played, Tong (now at 2 strength) should be banished
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [sisuEmpoweredSibling],
        inkwell: sisuEmpoweredSibling.cost,
        play: [iceBlock],
        deck: 1,
      },
      {
        play: [tongSurvivor],
        deck: 1,
      },
    );

    // Tong starts at 3 strength, above the threshold
    expect(testEngine.asPlayerTwo().getCardStrength(tongSurvivor)).toBe(tongSurvivor.strength);

    // Apply ice block: Tong gets -1 strength this turn (3-1=2)
    expect(
      testEngine.asPlayerOne().activateAbility(iceBlock, {
        targets: [tongSurvivor],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(tongSurvivor)).toBe(tongSurvivor.strength - 1);

    // Now play Sisu — Tong has 2 strength (exactly at threshold), should be banished
    expect(testEngine.asPlayerOne().playCard(sisuEmpoweredSibling)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(tongSurvivor)).toBe("discard");
  });
});
