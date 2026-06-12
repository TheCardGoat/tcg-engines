import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { liloEscapeArtist } from "@tcg/lorcana-cards/cards/006";
import { grandmotherWillowAncientAdvisor } from "@tcg/lorcana-cards/cards/011";
import { simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";

/**
 * THE-945: Grandmother Willow discount should apply when Lilo Escape Artist
 * is played from discard by her own start-of-turn trigger.
 */
describe("THE-945 Lilo Escape Artist + Grandmother Willow", () => {
  it("applies Willow's next-character discount to Lilo played from discard", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [grandmotherWillowAncientAdvisor],
        discard: [liloEscapeArtist],
        inkwell: 1,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
      {
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
    );

    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getBagCount()).toBe(2);

    expect(
      engine.asPlayerOne().resolvePendingByCard(grandmotherWillowAncientAdvisor),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(liloEscapeArtist, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getCardZone(liloEscapeArtist)).toBe("play");
    expect(engine.asPlayerOne().isExerted(liloEscapeArtist)).toBe(true);
    expect(engine.asPlayerOne().getAvailableInk("player_one")).toBe(0);
  });
});
