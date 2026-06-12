import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaScrappyCub } from "../characters";
import { heartOfAtlantis } from "./030-heart-of-atlantis";

describe("Heart of Atlantis", () => {
  it("reduces the cost of the next character you play this turn by 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [simbaScrappyCub],
      inkwell: 0,
      play: [heartOfAtlantis],
    });

    expect(testEngine.asPlayerOne().canPlayCard(simbaScrappyCub)).toBe(false);

    const result = testEngine.asPlayerOne().activateAbility(heartOfAtlantis, {
      ability: "LIFE GIVER",
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().canPlayCard(simbaScrappyCub)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(simbaScrappyCub)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(heartOfAtlantis)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(simbaScrappyCub)).toBe("play");
  });
});
