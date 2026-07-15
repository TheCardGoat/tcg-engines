import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack } from "../characters";
import { shieldOfVirtue } from "./135-shield-of-virtue";

describe("Shield of Virtue", () => {
  it("readies the chosen character and stops them from questing for the rest of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 3,
      play: [shieldOfVirtue, { card: heiheiBoatSnack, exerted: true }],
    });

    const result = testEngine.asPlayerOne().activateAbility(shieldOfVirtue, {
      ability: "FIREPROOF",
      targets: [heiheiBoatSnack],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toBeReady(heiheiBoatSnack);
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: heiheiBoatSnack,
      restriction: "cant-quest",
    });

    const questResult = testEngine.asPlayerOne().quest(heiheiBoatSnack);
    expect(questResult.success).toBe(false);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });
});
