import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { atitayaFangGeneral } from "./181-atitaya-fang-general";

describe("Atitaya - Fang General", () => {
  it("is a vanilla 7/7/7/3 character", () => {
    expect(atitayaFangGeneral.cost).toBe(7);
    expect(atitayaFangGeneral.strength).toBe(7);
    expect(atitayaFangGeneral.willpower).toBe(7);
    expect(atitayaFangGeneral.lore).toBe(3);
    expect(atitayaFangGeneral.vanilla).toBe(true);
  });

  it("can quest for 3 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [atitayaFangGeneral],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(atitayaFangGeneral)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 3);
  });
});
