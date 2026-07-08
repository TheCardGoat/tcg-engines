import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { peterPanCreatedByTheVine } from "./089-peter-pan-created-by-the-vine";

const challengedFloodborn = createMockCharacter({
  id: "peter-pan-vine-challenged-floodborn",
  name: "Challenged Floodborn",
  cost: 3,
  strength: 1,
  willpower: 5,
  classifications: ["Floodborn", "Hero"],
});

const challenger = createMockCharacter({
  id: "peter-pan-vine-challenger",
  name: "Challenger",
  cost: 3,
  strength: 1,
  willpower: 5,
});

const discardChoice = createMockCharacter({
  id: "peter-pan-vine-discard-choice",
  name: "Discard Choice",
  cost: 1,
});

describe("Peter Pan - Created by the Vine", () => {
  it("makes the challenging player discard when one of your Floodborn characters is challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [peterPanCreatedByTheVine, { card: challengedFloodborn, exerted: true }],
      },
      {
        play: [challenger],
        hand: [discardChoice],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(challenger, challengedFloodborn),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(peterPanCreatedByTheVine),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolveNextPending({ targets: [discardChoice] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(discardChoice)).toBe("discard");
  });
});
