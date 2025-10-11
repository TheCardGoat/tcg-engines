import { describe, expect, it } from "bun:test";
import { liloGalacticHero } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { letTheStormRageOn } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import {
  goofyKnightForADay,
  mickeyMouseFriendlyFace,
  mufasaBetrayedLeader,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mufasa - Betrayed Leader", () => {
  it("**THE SUN WILL SET** When this character is banished, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the top of your deck.", () => {
    const testStore = new TestStore({
      play: [mufasaBetrayedLeader],
      deck: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getCard(mufasaBetrayedLeader);
    const target = testStore.getCard(goofyKnightForADay);

    cardUnderTest.banish();

    expect(testStore.stackLayers).toHaveLength(1);
    testStore.resolveOptionalAbility();

    expect(target.zone).toBe("play");
    expect(target.meta.exerted).toBe(true);
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ deck: 0 }),
    );
  });
});

describe("Regressions", () => {
  it("Removed on opponent's turn", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: letTheStormRageOn.cost,
        hand: [letTheStormRageOn],
        deck: [mickeyMouseFriendlyFace, liloGalacticHero],
      },
      {
        play: [mufasaBetrayedLeader],
        deck: [goofyKnightForADay],
      },
    );

    const cardUnderTest = testEngine.getCardModel(mufasaBetrayedLeader);
    const target = testEngine.getCardModel(goofyKnightForADay);
    const notTarget = testEngine.getCardModel(mickeyMouseFriendlyFace);

    cardUnderTest.updateCardMeta({
      damage: mufasaBetrayedLeader.willpower - 1,
    });

    await testEngine.playCard(letTheStormRageOn);
    await testEngine.resolveTopOfStack({ targets: [cardUnderTest] }, true);

    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveOptionalAbility();

    expect(notTarget.zone).toBe("deck");
    expect(target.zone).toBe("play");
    expect(target.meta.exerted).toBe(true);
    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ deck: 0 }),
    );
  });
});
