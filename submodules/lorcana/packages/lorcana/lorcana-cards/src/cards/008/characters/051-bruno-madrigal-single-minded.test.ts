import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { brunoMadrigalSingleminded } from "./051-bruno-madrigal-single-minded";

const opposingCharacter = createMockCharacter({
  id: "bruno-opposing-character",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Bruno Madrigal - Single-Minded", () => {
  it("STANDING TALL - chosen opposing character can't ready at the start of their next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [brunoMadrigalSingleminded],
        inkwell: brunoMadrigalSingleminded.cost,
      },
      {
        play: [{ card: opposingCharacter, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(brunoMadrigalSingleminded, {
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(brunoMadrigalSingleminded),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [opposingCharacter] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(brunoMadrigalSingleminded)).toBe(false);
  });
});
