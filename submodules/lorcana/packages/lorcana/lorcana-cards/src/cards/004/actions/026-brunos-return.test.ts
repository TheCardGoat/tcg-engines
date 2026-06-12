import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { moanaOfMotunui, simbaProtectiveCub } from "../../001";
import { brunosReturn } from "./026-brunos-return";

describe("Bruno's Return", () => {
  it("returns a character from discard to hand and removes up to 2 damage from a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [brunosReturn],
      inkwell: brunosReturn.cost,
      discard: [simbaProtectiveCub],
      play: [moanaOfMotunui],
    });

    testEngine.asServer().manualSetDamage(moanaOfMotunui, 3);

    expect(
      testEngine.asPlayerOne().playCard(brunosReturn, {
        targets: [simbaProtectiveCub, moanaOfMotunui],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getDamage(moanaOfMotunui)).toBe(1);
  });
});
