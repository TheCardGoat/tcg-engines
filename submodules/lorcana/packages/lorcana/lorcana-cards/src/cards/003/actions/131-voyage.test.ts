import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { prideLandsPrideRock } from "../locations";
import { voyage } from "./131-voyage";

describe("Voyage", () => {
  it("moves up to 2 of your characters to the chosen location for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [voyage],
      inkwell: voyage.cost,
      play: [prideLandsPrideRock, arielOnHumanLegs, simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCard(voyage, {
        targets: [arielOnHumanLegs, simbaProtectiveCub, prideLandsPrideRock],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: arielOnHumanLegs,
      location: prideLandsPrideRock,
    });
    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: simbaProtectiveCub,
      location: prideLandsPrideRock,
    });
  });

  it("can move a single character to the chosen location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [voyage],
      inkwell: voyage.cost,
      play: [prideLandsPrideRock, arielOnHumanLegs, simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCard(voyage, {
        targets: [simbaProtectiveCub, prideLandsPrideRock],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: simbaProtectiveCub,
      location: prideLandsPrideRock,
    });
    expect(testEngine.asPlayerOne()).not.toBeAtLocation({
      card: arielOnHumanLegs,
      location: prideLandsPrideRock,
    });
  });
});
