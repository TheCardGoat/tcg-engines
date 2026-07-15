import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { ratigansMarvelousTrap } from "./102-ratigans-marvelous-trap";

describe("Ratigan's Marvelous Trap", () => {
  it("banishes itself and each opponent loses 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        lore: 4,
        play: [ratigansMarvelousTrap],
      },
      {
        lore: 3,
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(ratigansMarvelousTrap);

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(ratigansMarvelousTrap)).toBe("discard");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(4);
    expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(1);
  });
});
