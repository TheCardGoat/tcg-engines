/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  mufasaRulerOfPrideRock,
  scarBetrayer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scar - Betrayer", () => {
  it("**LONG LIVE THE KING** When you play this character, you may banish chosen character named Mufasa.", () => {
    const testStore = new TestStore({
      inkwell: scarBetrayer.cost,
      hand: [scarBetrayer],
      play: [mufasaRulerOfPrideRock],
    });

    const cardUnderTest = testStore.getCard(scarBetrayer);
    const mufasa = testStore.getCard(mufasaRulerOfPrideRock);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [mufasa] });

    expect(mufasa.zone).toEqual("discard");
  });
});
