import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { taffytaMuttonfudgeRuthlessRival } from "./103-taffyta-muttonfudge-ruthless-rival";

describe("Taffyta Muttonfudge - Ruthless Rival", () => {
  it("is a vanilla 2/2/2/2 character", () => {
    expect(taffytaMuttonfudgeRuthlessRival.cost).toBe(2);
    expect(taffytaMuttonfudgeRuthlessRival.strength).toBe(2);
    expect(taffytaMuttonfudgeRuthlessRival.willpower).toBe(2);
    expect(taffytaMuttonfudgeRuthlessRival.lore).toBe(2);
    expect(taffytaMuttonfudgeRuthlessRival.vanilla).toBe(true);
  });

  it("can quest for 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [taffytaMuttonfudgeRuthlessRival],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(taffytaMuttonfudgeRuthlessRival)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 2);
  });
});
