import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { allFunnedOut } from "./164-all-funned-out";

describe("All Funned Out", () => {
  it("puts your chosen character into your inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [allFunnedOut],
      inkwell: allFunnedOut.cost,
      play: [simbaProtectiveCub],
    });
    expect(
      testEngine.asPlayerOne().playCardTo(allFunnedOut, simbaProtectiveCub),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("inkwell");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ play: 0, inkwell: allFunnedOut.cost + 1 });
    expect(testEngine.isCardFaceDown(simbaProtectiveCub, "inkwell", "p1")).toBe(true);

    const inkwellId = testEngine.findCardInstanceId(simbaProtectiveCub, "inkwell", "p1");

    expect(testEngine.asPlayerOne().getCardByInstance(inkwellId).exerted).toBe(true);
  });
});
