import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { chernabogEvildoer } from "../characters";
import { forbiddenMountainMaleficentsCastle } from "../locations";
import { andThenAlongCameZeus } from "./195-and-then-along-came-zeus";

describe("And Then Along Came Zeus", () => {
  it("deals 5 damage to the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [andThenAlongCameZeus],
      inkwell: andThenAlongCameZeus.cost,
      play: [chernabogEvildoer],
    });

    expect(
      testEngine.asPlayerOne().playCard(andThenAlongCameZeus, {
        targets: [chernabogEvildoer],
      }).success,
    ).toBe(true);

    expect(testEngine.asServer().getDamage(chernabogEvildoer)).toBe(5);
  });

  it("deals 5 damage to the chosen location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [andThenAlongCameZeus],
      inkwell: andThenAlongCameZeus.cost,
      play: [forbiddenMountainMaleficentsCastle],
    });

    expect(
      testEngine.asPlayerOne().playCard(andThenAlongCameZeus, {
        targets: [forbiddenMountainMaleficentsCastle],
      }).success,
    ).toBe(true);

    expect(testEngine.asServer().getDamage(forbiddenMountainMaleficentsCastle)).toBe(5);
  });
});
