import { describe, expect, it } from "bun:test";
import {
  aladdinCorneredSwordman,
  maleficentBinding,
  mauiHeroToAll,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { simbaPrideProtector } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Simba - Pride Protector", () => {
  it("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Simba.)", async () => {
    const testEngine = new TestEngine({
      play: [simbaPrideProtector],
    });

    const cardUnderTest = testEngine.getCardModel(simbaPrideProtector);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it.skip("UNDERSTAND THE BALANCE At the end of your turn, if this character is exerted, you may ready your other characters.", async () => {
    const testEngine = new TestEngine({
      inkwell: simbaPrideProtector.cost,
      play: [simbaPrideProtector],
      hand: [simbaPrideProtector],
    });

    await testEngine.playCard(simbaPrideProtector);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});

describe("Regression", () => {
  it("Untapping reckless should not ask to challenge again", async () => {
    const testEngine = new TestEngine(
      {
        play: [simbaPrideProtector, mauiHeroToAll],
      },
      {
        play: [maleficentBinding, aladdinCorneredSwordman],
        deck: 1,
      },
    );

    for (const card of [
      maleficentBinding,
      aladdinCorneredSwordman,
      simbaPrideProtector,
    ]) {
      await testEngine.tapCard(card);
    }

    await testEngine.challenge({
      attacker: mauiHeroToAll,
      defender: aladdinCorneredSwordman,
    });

    expect(testEngine.getCardModel(mauiHeroToAll).exerted).toBe(true);
    await testEngine.passTurn();
    testEngine.changeActivePlayer("player_one");
    await testEngine.resolveOptionalAbility();
    expect(testEngine.getCardModel(mauiHeroToAll).exerted).toBe(false);

    expect(testEngine.store.turnPlayer).toEqual("player_two");
  });

  // 7.4.4. Some triggered abilities are written as [Trigger Condition], if [Secondary Condition], [Effect]. These abilities check whether
  // the secondary condition is true both when the effect would be added to the bag and again when the effect resolves.
  it("Two Simbas should not untap each other", async () => {
    const testEngine = new TestEngine(
      {
        play: [simbaPrideProtector, simbaPrideProtector],
      },
      {
        play: [maleficentBinding, aladdinCorneredSwordman],
        deck: 2,
      },
    );

    const simbaZero = testEngine.getCardModel(simbaPrideProtector, 0);
    const simbaOne = testEngine.getCardModel(simbaPrideProtector, 1);

    for (const card of [simbaOne, simbaZero]) {
      await testEngine.tapCard(card);
    }

    await testEngine.passTurn("player_one", true);

    expect(testEngine.store.turnPlayer).toEqual("player_one");
    expect(testEngine.stackLayers).toHaveLength(2);

    // Both Simbas should be exerted
    expect(simbaOne.exerted).toBe(simbaZero.exerted);

    testEngine.resolveOptionalAbility();

    // Only one Simba should be untapped
    expect(simbaOne.exerted).not.toBe(simbaZero.exerted);

    testEngine.resolveOptionalAbility();

    // Only one Simba should be untapped
    expect(simbaOne.exerted).not.toBe(simbaZero.exerted);

    expect(testEngine.stackLayers).toHaveLength(0);
    expect(testEngine.store.turnPlayer).toEqual("player_two");
  });
});
