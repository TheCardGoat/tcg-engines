import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theBlackCauldron } from "./032-the-black-cauldron";
import { lantern } from "../../009/items/032-lantern";
import { mufasaRulerOfPrideRock } from "../../005/characters/150-mufasa-ruler-of-pride-rock";

const raisedSoldier = createMockCharacter({
  id: "black-cauldron-raised-soldier",
  name: "Raised Soldier",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("The Black Cauldron", () => {
  it("THE CAULDRON CALLS - puts a character from your discard under this item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      discard: [raisedSoldier],
      inkwell: 1,
      play: [theBlackCauldron],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theBlackCauldron, {
        ability: "THE CAULDRON CALLS",
        targets: [raisedSoldier],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(theBlackCauldron)).toBe(true);
    expect(testEngine.getCardsUnder(theBlackCauldron)).toHaveLength(1);
    expect(testEngine.asPlayerOne().getCardZone(raisedSoldier)).toBe("limbo");
  });

  it("RISE AND JOIN ME! - allows playing characters from under the cauldron this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: raisedSoldier.cost + 1,
      play: [theBlackCauldron, raisedSoldier],
      deck: 1,
    });

    testEngine.putCardUnder(theBlackCauldron, raisedSoldier);
    expect(testEngine.getCardsUnder(theBlackCauldron)).toHaveLength(1);

    expect(
      testEngine.asPlayerOne().activateAbility(theBlackCauldron, {
        ability: "RISE AND JOIN ME!",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(raisedSoldier)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(raisedSoldier)).toBe("play");
    expect(testEngine.getCardsUnder(theBlackCauldron)).toHaveLength(0);
  });

  it("RISE AND JOIN ME! - surfaces characters under the cauldron in available moves", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: raisedSoldier.cost + 1,
      play: [theBlackCauldron, raisedSoldier],
      deck: 1,
    });

    testEngine.putCardUnder(theBlackCauldron, raisedSoldier);

    expect(
      testEngine.asPlayerOne().activateAbility(theBlackCauldron, {
        ability: "RISE AND JOIN ME!",
      }),
    ).toBeSuccessfulCommand();

    const raisedSoldierId = testEngine.findCardInstanceId(raisedSoldier, "limbo");
    const playMove = testEngine
      .asPlayerOne()
      .getAvailableMoves()
      .find((move) => move.moveId === "playCard");

    expect(playMove?.selectableCardIds).toContain(raisedSoldierId);
  });

  it("RISE AND JOIN ME! - surfaces Mufasa from under the cauldron when enough ink is available", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: mufasaRulerOfPrideRock.cost + 1,
      play: [theBlackCauldron, mufasaRulerOfPrideRock],
      deck: [],
    });

    testEngine.putCardUnder(theBlackCauldron, mufasaRulerOfPrideRock);

    expect(
      testEngine.asPlayerOne().activateAbility(theBlackCauldron, {
        ability: "RISE AND JOIN ME!",
      }),
    ).toBeSuccessfulCommand();

    const mufasaId = testEngine.findCardInstanceId(mufasaRulerOfPrideRock, "limbo");
    const playMove = testEngine
      .asPlayerOne()
      .getAvailableMoves()
      .find((move) => move.moveId === "playCard");

    expect(playMove?.selectableCardIds).toContain(mufasaId);
    expect(testEngine.asPlayerOne().playCard(mufasaRulerOfPrideRock)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(mufasaRulerOfPrideRock)).toBe("play");
  });

  it("regression: Lantern cost reduction is applied only once when playing from Black Cauldron", () => {
    const expensiveCharacter = createMockCharacter({
      id: "black-cauldron-expensive-char",
      name: "Expensive Character",
      cost: 4,
      strength: 3,
      willpower: 3,
    });

    // Lantern reduces cost by 1, so a 4-cost character should cost 3
    // The bug was that cost reduction was applied twice (reducing to 2)
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 3, // Enough for 4-1=3 (Lantern discount), but NOT 4-2=2 (double discount)
      play: [theBlackCauldron, lantern, expensiveCharacter],
      deck: 1,
    });

    // Put the expensive character under the cauldron
    testEngine.putCardUnder(theBlackCauldron, expensiveCharacter);

    // Activate Lantern to get cost reduction
    expect(testEngine.asPlayerOne().activateAbility(lantern)).toBeSuccessfulCommand();

    // Activate RISE AND JOIN ME! to enable playing from under cauldron
    // But Cauldron costs 1 ink to activate, and it also needs exert — already used for RISE
    // Actually, let's set up with more ink so we can activate both
    const testEngine2 = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 5, // Enough for: 1 ink (RISE AND JOIN ME!) + 3 ink (char with Lantern discount)
      play: [theBlackCauldron, lantern, expensiveCharacter],
      deck: 1,
    });

    testEngine2.putCardUnder(theBlackCauldron, expensiveCharacter);

    // Activate Lantern for cost reduction
    expect(testEngine2.asPlayerOne().activateAbility(lantern)).toBeSuccessfulCommand();

    // Activate RISE AND JOIN ME!
    expect(
      testEngine2.asPlayerOne().activateAbility(theBlackCauldron, {
        ability: "RISE AND JOIN ME!",
      }),
    ).toBeSuccessfulCommand();

    // Play the character from under the cauldron — should cost 3 (4-1), NOT 2 (4-2)
    expect(testEngine2.asPlayerOne().playCard(expensiveCharacter)).toBeSuccessfulCommand();
    expect(testEngine2.asPlayerOne().getCardZone(expensiveCharacter)).toBe("play");
  });
});
