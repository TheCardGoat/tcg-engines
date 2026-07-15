import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { galacticCouncilChamberCourtroom } from "../locations/204-galactic-council-chamber-courtroom";
import { transportPod } from "./100-transport-pod";

const transportedCharacter = createMockCharacter({
  id: "transport-pod-transported-character",
  name: "Transported Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Transport Pod", () => {
  it("may move one of your characters to a location for free at the start of your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [transportPod, galacticCouncilChamberCourtroom, transportedCharacter],
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().resolvePendingByCard(transportPod)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [transportedCharacter, galacticCouncilChamberCourtroom],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: transportedCharacter,
      location: galacticCouncilChamberCourtroom,
    });
  });
});
