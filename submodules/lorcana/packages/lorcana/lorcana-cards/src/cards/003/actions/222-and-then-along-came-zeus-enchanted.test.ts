import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { forbiddenMountainMaleficentsCastle } from "../locations";
import { andThenAlongCameZeusEnchanted } from "./222-and-then-along-came-zeus-enchanted";

describe("And Then Along Came Zeus - Enchanted", () => {
  it("deals 5 damage to the chosen location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [andThenAlongCameZeusEnchanted],
      inkwell: andThenAlongCameZeusEnchanted.cost,
      play: [forbiddenMountainMaleficentsCastle],
    });

    expect(
      testEngine.asPlayerOne().playCard(andThenAlongCameZeusEnchanted, {
        targets: [forbiddenMountainMaleficentsCastle],
      }).success,
    ).toBe(true);

    expect(testEngine.asServer().getDamage(forbiddenMountainMaleficentsCastle)).toBe(5);
  });
});
