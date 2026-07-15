import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { napoleonCleverBloodhound } from "./096-napoleon-clever-bloodhound";

describe("Napoleon - Clever Bloodhound", () => {
  it("is a vanilla 4/3/6/1 character", () => {
    expect(napoleonCleverBloodhound.vanilla).toBe(true);
    expect(napoleonCleverBloodhound.abilities).toBeUndefined();
    expect(napoleonCleverBloodhound.cost).toBe(4);
    expect(napoleonCleverBloodhound.strength).toBe(3);
    expect(napoleonCleverBloodhound.willpower).toBe(6);
    expect(napoleonCleverBloodhound.lore).toBe(1);
  });

  it("can quest for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [napoleonCleverBloodhound],
      deck: 2,
    });

    const loreBefore = testEngine.getLore(PLAYER_ONE);

    expect(testEngine.asPlayerOne().quest(napoleonCleverBloodhound)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
  });
});
