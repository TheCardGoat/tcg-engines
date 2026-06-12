import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { morganaMacawberSelfcenteredSpellcaster } from "./040-morgana-macawber-self-centered-spellcaster";

describe("Morgana Macawber - Self-Centered Spellcaster", () => {
  it("can be played as a vanilla character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [morganaMacawberSelfcenteredSpellcaster],
      inkwell: morganaMacawberSelfcenteredSpellcaster.cost,
      deck: 5,
    });

    expect(
      testEngine.asPlayerOne().playCard(morganaMacawberSelfcenteredSpellcaster),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(morganaMacawberSelfcenteredSpellcaster)).toBe(
      "play",
    );
  });

  it("has the correct stats (cost 3, strength 5, willpower 3, lore 1)", () => {
    expect(morganaMacawberSelfcenteredSpellcaster.cost).toBe(3);
    expect(morganaMacawberSelfcenteredSpellcaster.strength).toBe(5);
    expect(morganaMacawberSelfcenteredSpellcaster.willpower).toBe(3);
    expect(morganaMacawberSelfcenteredSpellcaster.lore).toBe(1);
  });

  it("can quest and gain 1 lore after drying", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: morganaMacawberSelfcenteredSpellcaster, isDrying: false }],
      deck: 5,
    });

    expect(
      testEngine.asPlayerOne().quest(morganaMacawberSelfcenteredSpellcaster),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
