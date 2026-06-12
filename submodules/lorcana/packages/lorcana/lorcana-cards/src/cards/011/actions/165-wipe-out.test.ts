import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { dinglehopper } from "../../001/items";
import { wipeOut } from "./165-wipe-out";

describe("Wipe Out!", () => {
  it("puts a chosen item into its player's inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wipeOut],
        inkwell: wipeOut.cost,
      },
      {
        play: [dinglehopper],
      },
    );
    const dinglehopperId = testEngine.findCardInstanceId(dinglehopper, "play", PLAYER_TWO);

    expect(
      testEngine.asPlayerOne().playCard(wipeOut, {
        targets: [dinglehopperId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(dinglehopperId)).toBe("inkwell");
    expect(testEngine.asServer().getCard(dinglehopperId)).toEqual(
      expect.objectContaining({ zone: "inkwell", exerted: true }),
    );
  });

  it("puts a chosen Bodyguard character into its player's inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wipeOut],
        inkwell: wipeOut.cost,
      },
      {
        play: [simbaProtectiveCub],
      },
    );
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

    expect(
      testEngine.asPlayerOne().playCard(wipeOut, {
        targets: [simbaId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(simbaId)).toBe("inkwell");
    expect(testEngine.asServer().getCard(simbaId)).toEqual(
      expect.objectContaining({ zone: "inkwell", exerted: true }),
    );
  });
});
