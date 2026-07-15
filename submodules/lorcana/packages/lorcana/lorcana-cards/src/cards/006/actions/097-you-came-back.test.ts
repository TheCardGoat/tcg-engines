import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { youCameBack } from "./097-you-came-back";
import { youCameBackEnchanted } from "./213-you-came-back-enchanted";

describe("You Came Back", () => {
  it("readies the chosen exerted character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [youCameBack],
      inkwell: youCameBack.cost,
      play: [{ card: simbaProtectiveCub, exerted: true }],
    });

    expect(
      testEngine.asPlayerOne().playCardTo(youCameBack, simbaProtectiveCub),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toBeReady(simbaProtectiveCub);
  });

  it("enchanted version shares the same canonical id and abilities as the base", () => {
    expect(youCameBackEnchanted.canonicalId).toBe(youCameBack.canonicalId);
    expect(youCameBackEnchanted.abilities).toEqual(youCameBack.abilities);
  });
});
