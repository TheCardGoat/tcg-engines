import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { dellasMoonLullaby } from "./028-dellas-moon-lullaby";

describe("Della's Moon Lullaby", () => {
  it("reduces the chosen opposing character's strength and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [dellasMoonLullaby],
        inkwell: dellasMoonLullaby.cost,
        deck: [simbaProtectiveCub],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(dellasMoonLullaby, {
      targets: [goofyKnightForADay],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(goofyKnightForADay)).toBe(8);
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
    expect(testEngine.asPlayerOne().getCardZone(dellasMoonLullaby)).toBe("discard");
  });
});
