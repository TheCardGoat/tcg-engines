import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { antonioMadrigalAnimalDoctor } from "./157-antonio-madrigal-animal-doctor";

const damagedCharacter = createMockCharacter({
  id: "antonio-animal-doctor-damaged-character",
  name: "Damaged Character",
  cost: 2,
  willpower: 5,
});

const inkwellCard = createMockCharacter({
  id: "antonio-animal-doctor-inkwell-card",
  name: "Inkwell Card",
  cost: 1,
});

describe("Antonio Madrigal - Animal Doctor", () => {
  it("may heal one of your characters and put the top card of your deck into your inkwell", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [antonioMadrigalAnimalDoctor],
      inkwell: antonioMadrigalAnimalDoctor.cost,
      play: [{ card: damagedCharacter, damage: 2 }],
      deck: [inkwellCard],
    });

    expect(testEngine.asPlayerOne().playCard(antonioMadrigalAnimalDoctor)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(antonioMadrigalAnimalDoctor, {
        resolveOptional: true,
        targets: [damagedCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(inkwellCard)).toBe("inkwell");
  });

  it("does not heal or put a card into the inkwell when the optional ability is declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [antonioMadrigalAnimalDoctor],
      inkwell: antonioMadrigalAnimalDoctor.cost,
      play: [{ card: damagedCharacter, damage: 2 }],
      deck: [inkwellCard],
    });

    expect(testEngine.asPlayerOne().playCard(antonioMadrigalAnimalDoctor)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(antonioMadrigalAnimalDoctor, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(2);
    expect(testEngine.asPlayerOne().getCardZone(inkwellCard)).toBe("deck");
  });
});
