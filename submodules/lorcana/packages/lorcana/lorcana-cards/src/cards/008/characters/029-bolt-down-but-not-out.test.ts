import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { boltDownButNotOut } from "./029-bolt-down-but-not-out";

describe("Bolt - Down but Not Out", () => {
  it("enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [boltDownButNotOut],
      inkwell: boltDownButNotOut.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(boltDownButNotOut)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(boltDownButNotOut)).toBe(true);
  });
});
