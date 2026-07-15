import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { chemPurse } from "./119-chem-purse";
import { iceSpikes } from "./084-ice-spikes";

const opposingCharacter = createMockCharacter({
  id: "ice-spikes-opposing-character",
  name: "Opposing Character",
  cost: 2,
});

describe("Ice Spikes", () => {
  it("exerts the chosen opposing character when you play it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [iceSpikes],
        inkwell: iceSpikes.cost,
      },
      {
        play: [opposingCharacter],
      },
    );

    expect(testEngine.asPlayerOne().playCard(iceSpikes)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(iceSpikes)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [opposingCharacter],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
  });

  it("exerts the chosen opposing item and stops it from readying during its next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [iceSpikes],
      },
      {
        play: [chemPurse],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(iceSpikes, {
        ability: "IT'S STUCK",
        targets: [chemPurse],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(chemPurse)).toBe(true);
    expect(testEngine.hasRestriction(chemPurse, "cant-ready")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(chemPurse)).toBe(true);
    expect(testEngine.hasRestriction(chemPurse, "cant-ready")).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasRestriction(chemPurse, "cant-ready")).toBe(false);

    const chemPurseId = testEngine.findCardInstanceId(chemPurse, "play", PLAYER_TWO);
    expect(testEngine.asServer().manualReadyCard(chemPurseId)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(chemPurse)).toBe(false);
  });
});
