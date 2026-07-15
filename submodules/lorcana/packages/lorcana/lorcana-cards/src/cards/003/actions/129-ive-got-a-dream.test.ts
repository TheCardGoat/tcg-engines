import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../../001";
import { prideLandsPrideRock } from "../locations";
import { iveGotADream } from "./129-ive-got-a-dream";

describe("I've Got a Dream", () => {
  it("readies your chosen character at a location, stops them from questing, and gains that location's lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [iveGotADream],
      inkwell: iveGotADream.cost,
      play: [
        prideLandsPrideRock,
        {
          card: arielOnHumanLegs,
          exerted: true,
          atLocation: prideLandsPrideRock,
        },
      ],
    });

    expect(
      testEngine.asPlayerOne().playCard(iveGotADream, {
        targets: [arielOnHumanLegs],
      }).success,
    ).toBe(true);

    expect(testEngine.asServer().getCard(arielOnHumanLegs).exerted).toBe(false);
    expect(testEngine.hasRestriction(arielOnHumanLegs, "cant-quest")).toBe(true);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(prideLandsPrideRock.lore);
  });
});
