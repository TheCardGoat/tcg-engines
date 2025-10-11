import { describe, expect, it } from "bun:test";
import {
  donaldDuckMusketeer,
  mickeyMouseMusketeer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { hiramFlavershamToymaker } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { goofyMusketeerSwordsman } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Goofy Musketeer - Swordsman", () => {
  it("**EN GAWRSH!** Whenever you play a character with **Bodyguard**, ready this character. He can't quest for the rest of this turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 10,
        play: [goofyMusketeerSwordsman],
        hand: [mickeyMouseMusketeer, donaldDuckMusketeer],
      },
      {
        play: [hiramFlavershamToymaker],
      },
    );

    const cardUnderTest = testEngine.getCardModel(goofyMusketeerSwordsman);
    const target = testEngine.getCardModel(hiramFlavershamToymaker);

    await testEngine.tapCard(target);

    // Questing should work and exert goofy
    await testEngine.questCard(goofyMusketeerSwordsman);
    expect(cardUnderTest.exerted).toBe(true);

    // Playing a musketeer should ready goofy and set quest restriction
    await testEngine.playCard(mickeyMouseMusketeer, { bodyguard: true });

    expect(cardUnderTest.exerted).toBe(false);
    expect(cardUnderTest.hasQuestRestriction).toBe(true);

    // Challenging should work and banish target, goofy should be exerted
    await testEngine.challenge({
      attacker: cardUnderTest,
      defender: target,
    });
    expect(cardUnderTest.exerted).toBe(true);

    // Playing a musketeer should ready goofy
    await testEngine.playCard(donaldDuckMusketeer, { bodyguard: true });

    expect(cardUnderTest.exerted).toBe(false);

    // Challenging again shoud work and banish target, goofy should be exerted
    await testEngine.challenge({
      attacker: cardUnderTest,
      defender: target,
    });
    expect(cardUnderTest.exerted).toBe(true);
    expect(cardUnderTest.damage).toBe(2);
    expect(target.zone).toEqual("discard");
  });
});
