import { describe, expect, it } from "bun:test";
import {
  brawl,
  weDontTalkAboutBruno,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import {
  aladdinBraveRescuer,
  aladdinResoluteSwordsman,
  argesTheCyclops,
  herculesBelovedHero,
  sisuEmboldenedWarrior,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("We Don't Talk About Bruno", () => {
  it("should return  opponent chosen character to their player's hand and discard opponent card", () => {
    const testStore = new TestStore(
      {
        inkwell: weDontTalkAboutBruno.cost,
        hand: [weDontTalkAboutBruno],
      },
      {
        hand: [
          herculesBelovedHero,
          brawl,
          aladdinResoluteSwordsman,
          argesTheCyclops,
        ],
        play: [aladdinBraveRescuer],
      },
    );

    const cardUnderTest = testStore.getCard(weDontTalkAboutBruno);
    const target = testStore.getCard(aladdinBraveRescuer);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] }, true);

    expect(target.zone).toBe("hand");

    expect(testStore.getZonesCardCount("player_two").hand).toBe(4);
    expect(testStore.getZonesCardCount("player_two").discard).toBe(1);
  });

  it("should return  opponent chosen character to their player's hand and discard opponent card", async () => {
    const testEngine = new TestEngine({
      inkwell: weDontTalkAboutBruno.cost,
      play: [aladdinBraveRescuer],
      hand: [
        weDontTalkAboutBruno,
        herculesBelovedHero,
        brawl,
        aladdinResoluteSwordsman,
        argesTheCyclops,
      ],
    });

    await testEngine.playCard(weDontTalkAboutBruno, {
      targets: [aladdinBraveRescuer],
    });

    expect(testEngine.getCardModel(aladdinBraveRescuer).zone).not.toBe("play");
    expect(testEngine.getZonesCardCount().hand).toBe(4);
    expect(testEngine.getZonesCardCount().discard).toBe(2);
  });

  it("Return chosen character to their player's hand, then that player discards a card at random.", () => {
    const testStore = new TestStore(
      {
        inkwell: weDontTalkAboutBruno.cost,
        hand: [weDontTalkAboutBruno],
      },
      {
        play: [aladdinBraveRescuer],
        hand: [sisuEmboldenedWarrior],
      },
    );

    const cardUnderTest = testStore.getCard(weDontTalkAboutBruno);
    const target = testStore.getCard(aladdinBraveRescuer);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });
    expect(testStore.getZonesCardCount("player_two").hand).toBe(1);
  });

  it("No cards in hand and a single card in play", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: weDontTalkAboutBruno.cost,
        hand: [weDontTalkAboutBruno],
      },
      {
        play: [aladdinBraveRescuer],
      },
    );

    await testEngine.playCard(weDontTalkAboutBruno);

    expect(testEngine.store.stackLayerStore.topLayer?.id).toContain("_move");

    await testEngine.resolveTopOfStack({ targets: [aladdinBraveRescuer] });

    expect(testEngine.getCardModel(aladdinBraveRescuer).zone).toBe("discard");
  });
});

describe("Regression", () => {
  it("Should not discard from hand if no valid target to return to hand", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: weDontTalkAboutBruno.cost,
        hand: [weDontTalkAboutBruno],
      },
      {
        hand: [aladdinBraveRescuer],
      },
    );

    await testEngine.playCard(weDontTalkAboutBruno);

    expect(testEngine.getCardModel(aladdinBraveRescuer).zone).toBe("hand");
    expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
  });
});
