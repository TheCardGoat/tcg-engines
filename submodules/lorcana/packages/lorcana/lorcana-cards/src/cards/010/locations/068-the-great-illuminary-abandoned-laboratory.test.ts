import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theGreatIlluminaryAbandonedLaboratory } from "./068-the-great-illuminary-abandoned-laboratory";

const laboratoryGuest = createMockCharacter({
  id: "laboratory-guest",
  name: "Laboratory Guest",
  cost: 2,
  willpower: 4,
});

describe("The Great Illuminary - Abandoned Laboratory", () => {
  it("grants characters here an exert-to-draw ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        theGreatIlluminaryAbandonedLaboratory,
        { card: laboratoryGuest, atLocation: theGreatIlluminaryAbandonedLaboratory },
      ],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(laboratoryGuest, "STARTLING DISCOVERY").success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCard(laboratoryGuest).exerted).toBe(true);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
});
