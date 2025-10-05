import { describe, expect, it } from "bun:test";
import {
  mickeyMouseDetective,
  teKaTheBurningOne,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  dalmatianPuppyTailWagger,
  fantasticalAndMagical,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Fantastical And Magical", () => {
  it("Sing Together 9 (Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      hand: [fantasticalAndMagical],
    });

    expect(
      testEngine.getCardModel(fantasticalAndMagical).hasSingTogether,
    ).toEqual(true);
  });

  it("For each character that sang this song, draw a card and gain 1 lore.", async () => {
    const cardsInPlay = [
      teKaTheBurningOne, // Cost 6
      mickeyMouseDetective, // Cost 3
    ]; // Total: 9, meets sing-together requirement exactly
    const testEngine = new TestEngine({
      hand: [fantasticalAndMagical],
      play: cardsInPlay,
      deck: 10,
    });

    await testEngine.singSongTogether({
      song: fantasticalAndMagical,
      singers: cardsInPlay,
    });

    expect(testEngine.getPlayerLore("player_one")).toEqual(cardsInPlay.length);
    expect(testEngine.getZonesCardCount().hand).toEqual(cardsInPlay.length);
  });
});
