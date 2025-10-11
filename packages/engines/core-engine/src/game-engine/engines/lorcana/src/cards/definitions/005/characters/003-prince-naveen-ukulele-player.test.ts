import { describe, expect, it } from "bun:test";
import {
  aWholeNewWorld,
  hakunaMatata,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import {
  peteGamesReferee,
  princeNaveenUkulelePlayer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prince Naveen - Ukulele Player", () => {
  it("**IT’S BEAUTIFUL NO?** When you play this character, you may play a song with cost 6 or less for free.", () => {
    const testStore = new TestStore({
      inkwell: princeNaveenUkulelePlayer.cost,
      hand: [princeNaveenUkulelePlayer, hakunaMatata],
      deck: 2,
    });

    const cardUnderTest = testStore.getCard(princeNaveenUkulelePlayer);
    const targetCard = testStore.getCard(hakunaMatata);

    cardUnderTest.playFromHand();
    expect(testStore.stackLayers).toHaveLength(1);
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [targetCard] });
    expect(targetCard.zone).toBe("discard");
  });
});

describe("Regressions", () => {
  it("Can't play if there's play restrictions", () => {
    const testStore = new TestStore(
      {
        inkwell: peteGamesReferee.cost,
        hand: [peteGamesReferee],
        deck: 1,
      },
      {
        inkwell: princeNaveenUkulelePlayer.cost,
        hand: [princeNaveenUkulelePlayer, aWholeNewWorld],
        deck: 2,
      },
    );

    const peteRestriction = testStore.getCard(peteGamesReferee);

    peteRestriction.playFromHand();
    expect(
      testStore.store.continuousEffectStore.continuousEffects,
    ).toHaveLength(1);

    testStore.passTurn();

    testStore.changePlayer("player_two");
    const cardUnderTest = testStore.getCard(princeNaveenUkulelePlayer);
    const targetCard = testStore.getCard(aWholeNewWorld);

    cardUnderTest.playFromHand();
    expect(
      testStore.store.continuousEffectStore.continuousEffects,
    ).toHaveLength(1);
    expect(testStore.stackLayers).toHaveLength(1);
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [targetCard] });
    expect(targetCard.zone).toBe("hand");
  });
});
