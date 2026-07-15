import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { prideLandsPrideRock } from "../locations";
import { iWillFindMyWay } from "./095-i-will-find-my-way";

describe("I Will Find My Way", () => {
  it("gives the chosen character +2 strength and moves them to a chosen location for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [iWillFindMyWay],
      inkwell: iWillFindMyWay.cost,
      play: [simbaProtectiveCub, prideLandsPrideRock],
    });

    expect(
      testEngine.asPlayerOne().playCardOptional(iWillFindMyWay, true, {
        targets: [simbaProtectiveCub, prideLandsPrideRock],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(simbaProtectiveCub).strength).toBe(
      simbaProtectiveCub.strength + 2,
    );
    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: simbaProtectiveCub,
      location: prideLandsPrideRock,
    });
  });
});
