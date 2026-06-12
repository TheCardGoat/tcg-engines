import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { dinglehopper } from "../../001";
import { hideAway } from "./163-hide-away";

describe("Hide Away", () => {
  it("puts the chosen item into its player's inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hideAway],
      inkwell: hideAway.cost,
      play: [dinglehopper],
    });
    const playerOne = testEngine.asPlayerOne();
    expect(playerOne.playCardTo(hideAway, dinglehopper)).toBeSuccessfulCommand();

    expect(playerOne.getCardZone(dinglehopper)).toBe("inkwell");
    expect(playerOne).toHaveZoneCounts({ play: 0, inkwell: hideAway.cost + 1 });
    expect(testEngine.isCardFaceDown(dinglehopper, "inkwell", "p1")).toBe(true);

    const inkwellId = testEngine.findCardInstanceId(dinglehopper, "inkwell", "p1");

    expect(testEngine.asPlayerOne().getCardByInstance(inkwellId).exerted).toBe(true);
  });
});
