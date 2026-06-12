import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { liloGalacticHero } from "../../001/characters/184-lilo-galactic-hero";
import { perplexingSignposts } from "./067-perplexing-signposts";

describe("Perplexing Signposts", () => {
  it("banishes itself to return one of your characters to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [perplexingSignposts, liloGalacticHero],
    });

    const result = testEngine.asPlayerOne().activateAbility(perplexingSignposts, {
      targets: [liloGalacticHero],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(perplexingSignposts)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(liloGalacticHero)).toBe("hand");
  });
});
