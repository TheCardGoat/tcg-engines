import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { naniNoWorries } from "./184-nani-no-worries";

describe("Nani - No Worries", () => {
  it("While this character has no damage, she gets +1 lore.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [naniNoWorries],
    });

    const nani = testEngine.getCard(naniNoWorries);
    expect(nani.lore).toBe(naniNoWorries.lore + 1);
  });

  it("While this character has damage, she doesn't get +1 lore.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [naniNoWorries],
    });

    testEngine.asServer().manualSetDamage(naniNoWorries, 1);

    const nani = testEngine.getCard(naniNoWorries);
    expect(nani.lore).toBe(naniNoWorries.lore);
  });
});
