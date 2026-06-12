import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { onYourFeetNow } from "./130-on-your-feet-now";

describe("On Your Feet! Now!", () => {
  it("readies your characters, deals 1 damage to each, and keeps them from questing this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [onYourFeetNow],
      inkwell: onYourFeetNow.cost,
      play: [
        { card: arielOnHumanLegs, exerted: true },
        { card: simbaProtectiveCub, exerted: true },
      ],
    });

    expect(testEngine.asPlayerOne().playCard(onYourFeetNow)).toBeSuccessfulCommand();

    expect(testEngine.asServer().getCard(arielOnHumanLegs).exerted).toBe(false);
    expect(testEngine.asServer().getCard(simbaProtectiveCub).exerted).toBe(false);
    expect(testEngine.asServer().getDamage(arielOnHumanLegs)).toBe(1);
    expect(testEngine.asServer().getDamage(simbaProtectiveCub)).toBe(1);
    expect(testEngine.hasRestriction(arielOnHumanLegs, "cant-quest")).toBe(true);
    expect(testEngine.hasRestriction(simbaProtectiveCub, "cant-quest")).toBe(true);
  });
});
