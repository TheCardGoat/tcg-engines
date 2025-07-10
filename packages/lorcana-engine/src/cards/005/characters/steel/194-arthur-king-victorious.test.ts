/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arthurKingVictorious,
  mufasaRulerOfPrideRock,
  princeNaveenUkulelePlayer,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Arthur - King Victorious", () => {
  it("**KNIGHTED BY THE KING** When you play this character, chosen character gains **Challenger** +2 and **Resist** +2 and can challenge ready characters this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_", () => {
    const testStore = new TestStore(
      {
        inkwell: arthurKingVictorious.cost,
        hand: [arthurKingVictorious],
        play: [princeNaveenUkulelePlayer],
      },
      {
        play: [mufasaRulerOfPrideRock],
        deck: 1,
      },
    );

    const cardUnderTest = testStore.getCard(arthurKingVictorious);
    const target = testStore.getCard(princeNaveenUkulelePlayer);
    const defender = testStore.getCard(mufasaRulerOfPrideRock);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.hasChallenger).toEqual(true);
    expect(target.hasResist).toEqual(true);
    expect(target.canChallenge(defender)).toEqual(true);

    testStore.passTurn();

    expect(target.hasChallenger).toEqual(false);
    expect(target.hasResist).toEqual(false);
    expect(target.canChallenge(defender)).toEqual(false);
  });
});
