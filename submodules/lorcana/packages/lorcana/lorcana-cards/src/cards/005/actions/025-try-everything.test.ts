import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { tryEverything } from "./025-try-everything";

describe("Try Everything", () => {
  it("removes damage, readies the chosen character, and stops them from questing or challenging this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tryEverything],
      inkwell: tryEverything.cost,
      play: [{ card: simbaProtectiveCub, damage: 3, exerted: true }],
    });

    expect(testEngine.asPlayerOne().playCardTo(tryEverything, simbaProtectiveCub).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne()).toBeReady(simbaProtectiveCub);
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: simbaProtectiveCub, value: 0 });
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: simbaProtectiveCub,
      restriction: "cant-quest",
    });
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: simbaProtectiveCub,
      restriction: "cant-challenge",
    });
  });
});
