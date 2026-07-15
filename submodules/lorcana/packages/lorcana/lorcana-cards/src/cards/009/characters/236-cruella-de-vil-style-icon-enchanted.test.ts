import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { cruellaDeVilStyleIconEnchanted } from "./236-cruella-de-vil-style-icon-enchanted";

const lowCostOpponentA = createMockCharacter({
  id: "cruella-enchanted-low-cost-a",
  name: "Low Cost Opponent A",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const lowCostOpponentB = createMockCharacter({
  id: "cruella-enchanted-low-cost-b",
  name: "Low Cost Opponent B",
  cost: 1,
  strength: 3,
  willpower: 3,
});

const highCostOpponent = createMockCharacter({
  id: "cruella-enchanted-high-cost",
  name: "High Cost Opponent",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Cruella De Vil - Style Icon (Enchanted)", () => {
  it("puts the top card of your deck into your inkwell once during your turn when a low-cost character is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [cruellaDeVilStyleIconEnchanted],
        hand: [dragonFire, dragonFire],
        inkwell: dragonFire.cost * 2,
        deck: 5,
      },
      {
        play: [lowCostOpponentA, lowCostOpponentB],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, { targets: [lowCostOpponentA] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
      deck: 4,
      inkwell: 11,
    });

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, { targets: [lowCostOpponentB] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
      deck: 4,
      inkwell: 11,
    });
  });

  it("gives opposing cost 2 or less characters -1 strength during your turn only", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [cruellaDeVilStyleIconEnchanted],
      },
      {
        play: [lowCostOpponentA, highCostOpponent],
      },
    );

    expect(testEngine.asPlayerOne().getCardStrength(lowCostOpponentA)).toBe(1);
    expect(testEngine.asPlayerOne().getCardStrength(highCostOpponent)).toBe(
      highCostOpponent.strength,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(lowCostOpponentA)).toBe(
      lowCostOpponentA.strength,
    );
    expect(testEngine.asPlayerOne().getCardStrength(highCostOpponent)).toBe(
      highCostOpponent.strength,
    );
  });
});
