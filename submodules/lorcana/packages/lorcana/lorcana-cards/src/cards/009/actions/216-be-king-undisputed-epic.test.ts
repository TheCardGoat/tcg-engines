import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { beKingUndisputedEpic } from "./216-be-king-undisputed-epic";

describe("Be King Undisputed Epic", () => {
  it("lets the opponent choose one of their characters to banish", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [beKingUndisputedEpic],
        inkwell: beKingUndisputedEpic.cost,
      },
      {
        play: [simbaProtectiveCub, arielOnHumanLegs],
      },
    );

    expect(testEngine.asPlayerOne().playCard(beKingUndisputedEpic)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolveNextPending({
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(arielOnHumanLegs)).toBe("play");
  });
});
