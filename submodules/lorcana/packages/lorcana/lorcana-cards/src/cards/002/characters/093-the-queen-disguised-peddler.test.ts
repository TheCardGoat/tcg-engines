import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { bashfulHopelessRomantic } from "./001-bashful-hopeless-romantic";
import { belleBookworm } from "./071-belle-bookworm";
import { theQueenDisguisedPeddler } from "./093-the-queen-disguised-peddler";

describe("The Queen - Disguised Peddler", () => {
  it("discards a chosen character card to gain lore equal to that card's lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [belleBookworm],
      play: [theQueenDisguisedPeddler],
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theQueenDisguisedPeddler, {
        costs: {
          discardCards: [belleBookworm],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(belleBookworm)).toBe("discard");
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(belleBookworm.lore);
  });

  it("gains lore equal to the discarded card's lore value (3-lore card)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bashfulHopelessRomantic],
      play: [theQueenDisguisedPeddler],
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theQueenDisguisedPeddler, {
        costs: {
          discardCards: [bashfulHopelessRomantic],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(bashfulHopelessRomantic)).toBe("discard");
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(bashfulHopelessRomantic.lore);
  });
});
