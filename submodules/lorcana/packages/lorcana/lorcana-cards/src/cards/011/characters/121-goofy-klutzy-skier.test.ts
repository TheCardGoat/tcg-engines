import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyKlutzySkier } from "./121-goofy-klutzy-skier";

const doomedTarget = createMockCharacter({
  id: "goofy-klutzy-skier-doomed-target",
  name: "Goofy Klutzy Skier Doomed Target",
  cost: 4,
});

describe("Goofy - Klutzy Skier", () => {
  it("banishes itself to banish a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [goofyKlutzySkier],
        deck: 1,
      },
      {
        play: [doomedTarget],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(goofyKlutzySkier, {
        targets: [doomedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(goofyKlutzySkier)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(doomedTarget)).toBe("discard");
  });
});
