import { describe, expect, it } from "bun:test";
import { liloEscapeArtist } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { naniHeistMastermind } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Nani - Heist Mastermind", () => {
  it("STICK TO THE PLAN {E} – Another chosen character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)", async () => {
    const testEngine = new TestEngine({
      inkwell: naniHeistMastermind.cost,
      play: [naniHeistMastermind, liloEscapeArtist],
      hand: [],
    });

    await testEngine.activateCard(naniHeistMastermind, {
      ability: "STICK TO THE PLAN",
      targets: [liloEscapeArtist],
    });
    expect(testEngine.getCardModel(liloEscapeArtist).hasResist).toBe(true);
  });

  it("IT'S UP TO YOU, LILO Your characters named Lilo gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      inkwell: naniHeistMastermind.cost,
      play: [naniHeistMastermind, liloEscapeArtist],
      hand: [],
    });

    expect(testEngine.getCardModel(liloEscapeArtist).hasSupport()).toBe(true);
  });
});
