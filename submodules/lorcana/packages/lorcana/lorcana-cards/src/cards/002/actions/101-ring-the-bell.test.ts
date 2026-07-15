import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { moanaOfMotunui } from "../../001";
import { ringTheBell } from "./101-ring-the-bell";

describe("Ring the Bell", () => {
  it("banishes the chosen damaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ringTheBell],
      inkwell: ringTheBell.cost,
      play: [{ card: moanaOfMotunui, damage: 1 }],
    });

    expect(
      testEngine.asPlayerOne().playCardTo(ringTheBell, moanaOfMotunui),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCard(moanaOfMotunui)).toBeInZone("discard");
  });

  it("does not banish an undamaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ringTheBell],
      inkwell: ringTheBell.cost,
      play: [moanaOfMotunui],
    });

    expect(
      testEngine.asPlayerOne().playCard(ringTheBell, {
        targets: [moanaOfMotunui],
      }),
    ).toMatchObject({
      success: false,
      errorCode: "INVALID_ACTION_TARGET",
    });

    expect(testEngine.getCard(moanaOfMotunui)).toBeInZone("play");
    expect(testEngine.getCard(ringTheBell)).toBeInZone("hand");
  });
});
