import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { naniCaringSister } from "./019-nani-caring-sister";
import { davidImpressiveSurfer } from "./008-david-impressive-surfer";

describe("David - Impressive Surfer", () => {
  it("has his printed lore without Nani in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [davidImpressiveSurfer],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardLore(davidImpressiveSurfer)).toBe(
      davidImpressiveSurfer.lore,
    );
  });

  it("SHOWING OFF - gets +2 lore while you have a character named Nani in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [davidImpressiveSurfer, naniCaringSister],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardLore(davidImpressiveSurfer)).toBe(
      davidImpressiveSurfer.lore + 2,
    );
  });
});
