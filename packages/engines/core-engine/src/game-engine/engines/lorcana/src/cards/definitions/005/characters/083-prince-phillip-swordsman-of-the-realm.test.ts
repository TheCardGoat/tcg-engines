/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { princePhillipSwordsmanOfTheRealm } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prince Phillip - Swordsman of the Realm", () => {
  it.skip("**SLAYER OF DRAGONS** When you play this character, banish chosen opposing Dragon character.", () => {
    const testStore = new TestStore({
      inkwell: princePhillipSwordsmanOfTheRealm.cost,
      hand: [princePhillipSwordsmanOfTheRealm],
    });

    const cardUnderTest = testStore.getCard(princePhillipSwordsmanOfTheRealm);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**PRESSING THE ADVANTAGE** When he challenges a damaged character, ready this character after the challenge.", () => {
    const testStore = new TestStore({
      inkwell: princePhillipSwordsmanOfTheRealm.cost,
      play: [princePhillipSwordsmanOfTheRealm],
    });

    const cardUnderTest = testStore.getCard(princePhillipSwordsmanOfTheRealm);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
