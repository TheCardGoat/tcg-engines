import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goonsMaleficentsUnderlings } from "./179-goons-maleficents-underlings";

describe("Goons - Maleficent’s Underlings", () => {
  it("can be played and quest on a later turn like a vanilla character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [goonsMaleficentsUnderlings],
        inkwell: goonsMaleficentsUnderlings.cost,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(goonsMaleficentsUnderlings.vanilla).toBe(true);

    expect(testEngine.asPlayerOne().playCard(goonsMaleficentsUnderlings)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(goonsMaleficentsUnderlings)).toBe("play");
    expect(testEngine.asPlayerOne().getCard(goonsMaleficentsUnderlings)).toMatchObject({
      strength: 2,
      willpower: 2,
      lore: 1,
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(goonsMaleficentsUnderlings)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
