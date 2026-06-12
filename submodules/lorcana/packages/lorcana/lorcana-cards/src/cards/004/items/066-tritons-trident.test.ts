import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tritonsTrident } from "./066-tritons-trident";

const empoweredTarget = createMockCharacter({
  id: "tritons-trident-target",
  name: "Empowered Target",
  cost: 2,
  strength: 2,
});

const handCardOne = createMockCharacter({
  id: "tritons-trident-hand-1",
  name: "Hand Card 1",
  cost: 1,
});

const handCardTwo = createMockCharacter({
  id: "tritons-trident-hand-2",
  name: "Hand Card 2",
  cost: 1,
});

const handCardThree = createMockCharacter({
  id: "tritons-trident-hand-3",
  name: "Hand Card 3",
  cost: 1,
});

describe("Triton's Trident", () => {
  it("gives the chosen character +1 strength this turn for each card in your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [handCardOne, handCardTwo, handCardThree],
      play: [tritonsTrident, empoweredTarget],
    });

    const baseStrength = testEngine.asPlayerOne().getCardStrength(empoweredTarget);

    expect(
      testEngine.asPlayerOne().activateAbility(tritonsTrident, {
        targets: [empoweredTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(empoweredTarget)).toBe(baseStrength + 3);
    expect(testEngine.asPlayerOne().getCardZone(tritonsTrident)).toBe("discard");
  });
});
