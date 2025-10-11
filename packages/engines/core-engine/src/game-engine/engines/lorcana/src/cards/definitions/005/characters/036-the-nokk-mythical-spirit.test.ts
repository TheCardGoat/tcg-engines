import { describe, expect, it } from "bun:test";
import {
  fixitFelixJrNicelandSteward,
  monstroWhaleOfAWhale,
  theNokkMythicalSpirit,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Nokk - Mythical Spirit", () => {
  it.skip("**TURNING TIDES** When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.", () => {
    const testStore = new TestStore(
      {
        inkwell: theNokkMythicalSpirit.cost,
        hand: [theNokkMythicalSpirit, fixitFelixJrNicelandSteward],
      },
      {
        play: [monstroWhaleOfAWhale],
      },
    );

    const cardUnderTest = testStore.getCard(theNokkMythicalSpirit);
    const damagedCharacter = testStore.getCard(fixitFelixJrNicelandSteward);
    damagedCharacter.updateCardDamage(2);
    const opposingCharacter = testStore.getCard(monstroWhaleOfAWhale);
    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({
      targets: [opposingCharacter],
    });
    testStore.resolveTopOfStack({
      targets: [damagedCharacter],
    });
    expect(damagedCharacter.damage).toBe(0);
    expect(opposingCharacter.damage).toBe(2);
  });
});
