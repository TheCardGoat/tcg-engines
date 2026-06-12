import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { sleepyHollowTheBridge } from "../locations/136-sleepy-hollow-the-bridge";
import { getToSafety } from "./130-get-to-safety";

describe("Get to Safety!", () => {
  it("plays a location from discard and draws if Sleepy Hollow is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [getToSafety],
      inkwell: getToSafety.cost,
      discard: [sleepyHollowTheBridge],
      deck: [simbaProtectiveCub],
    });

    const playResult = testEngine.asPlayerOne().playCard(getToSafety, {
      targets: [sleepyHollowTheBridge],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(sleepyHollowTheBridge)).toBe("play");
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
  });
});
