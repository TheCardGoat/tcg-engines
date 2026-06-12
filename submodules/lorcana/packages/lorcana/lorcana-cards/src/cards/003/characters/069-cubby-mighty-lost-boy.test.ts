import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { cubbyMightyLostBoy } from "./069-cubby-mighty-lost-boy";

const firstLocation = createMockLocation({
  id: "cubby-first-location",
  name: "Cubby First Location",
  cost: 2,
  moveCost: 1,
});

const secondLocation = createMockLocation({
  id: "cubby-second-location",
  name: "Cubby Second Location",
  cost: 2,
  moveCost: 1,
});

describe("Cubby - Mighty Lost Boy", () => {
  it("gets +3 strength each time he moves to a location, then loses the bonus at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [cubbyMightyLostBoy, firstLocation, secondLocation],
      inkwell: 2,
      deck: 1,
    });

    const baseStrength = cubbyMightyLostBoy.strength;

    expect(testEngine.asPlayerOne().getCard(cubbyMightyLostBoy)?.strength).toBe(baseStrength);

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(cubbyMightyLostBoy, firstLocation).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCard(cubbyMightyLostBoy)?.strength).toBe(baseStrength + 3);

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(cubbyMightyLostBoy, secondLocation).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCard(cubbyMightyLostBoy)?.strength).toBe(baseStrength + 6);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(cubbyMightyLostBoy)?.strength).toBe(baseStrength);
  });
});
