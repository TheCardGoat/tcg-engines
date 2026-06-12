import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { bosssOrders, healWhatHasBeenHurt } from "../actions";
import { simbaScrappyCub } from "../characters";
import { starlightVial } from "./099-starlight-vial";

describe("Starlight Vial", () => {
  it("reduces the cost of the next action you play this turn by 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [healWhatHasBeenHurt],
      inkwell: 1,
      play: [starlightVial, simbaScrappyCub],
    });

    expect(testEngine.asPlayerOne().canPlayCard(healWhatHasBeenHurt)).toBe(false);

    const result = testEngine.asPlayerOne().activateAbility(starlightVial, {
      ability: "EFFICIENT ENERGY",
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().canPlayCard(healWhatHasBeenHurt)).toBe(true);
    expect(
      testEngine.asPlayerOne().playCard(healWhatHasBeenHurt, {
        targets: [simbaScrappyCub],
      }),
    ).toBeSuccessfulCommand();
  });

  it("draws 2 cards, then chooses and discards a card for TRAP 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [bosssOrders, healWhatHasBeenHurt],
      inkwell: 2,
      play: [starlightVial],
    });

    const result = testEngine.asPlayerOne().activateAbility(starlightVial, {
      ability: "TRAP",
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(starlightVial)).toBe("discard");
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, deck: 0 });

    expect(testEngine.asPlayerOne().respondWith(healWhatHasBeenHurt)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, discard: 2 });
    expect(testEngine.asPlayerOne().getCardZone(healWhatHasBeenHurt)).toBe("discard");
  });
});
