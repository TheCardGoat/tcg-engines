import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theBlackCauldronEnchanted } from "./225-the-black-cauldron-enchanted";

const raisedSoldier = createMockCharacter({
  id: "black-cauldron-enchanted-raised-soldier",
  name: "Raised Soldier",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("The Black Cauldron (Enchanted)", () => {
  it("THE CAULDRON CALLS - puts a character from your discard under this item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      discard: [raisedSoldier],
      inkwell: 1,
      play: [theBlackCauldronEnchanted],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theBlackCauldronEnchanted, {
        ability: "THE CAULDRON CALLS",
        targets: [raisedSoldier],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(theBlackCauldronEnchanted)).toBe(true);
    expect(testEngine.getCardsUnder(theBlackCauldronEnchanted)).toHaveLength(1);
    expect(testEngine.asPlayerOne().getCardZone(raisedSoldier)).toBe("limbo");
  });

  it("RISE AND JOIN ME! - allows playing characters from under the cauldron this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: raisedSoldier.cost + 1,
      play: [theBlackCauldronEnchanted, raisedSoldier],
      deck: 1,
    });

    testEngine.putCardUnder(theBlackCauldronEnchanted, raisedSoldier);
    expect(testEngine.getCardsUnder(theBlackCauldronEnchanted)).toHaveLength(1);

    expect(
      testEngine.asPlayerOne().activateAbility(theBlackCauldronEnchanted, {
        ability: "RISE AND JOIN ME!",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(raisedSoldier)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(raisedSoldier)).toBe("play");
    expect(testEngine.getCardsUnder(theBlackCauldronEnchanted)).toHaveLength(0);
  });
});
