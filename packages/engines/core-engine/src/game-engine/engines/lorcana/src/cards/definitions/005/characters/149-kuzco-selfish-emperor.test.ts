/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import {
  kuzcoSelfishEmperor,
  monstroWhaleOfAWhale,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Kuzco - Selfish Emperor", () => {
  it("**OUTPLACEMENT** When you play this character, you may put chosen item or location into its player’s inkwell facedown and exerted.<br/>**BY INVITE ONLY** 4 {I} − Your other characters gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_", () => {
    const testStore = new TestStore(
      {
        inkwell: kuzcoSelfishEmperor.cost,
        hand: [kuzcoSelfishEmperor],
      },
      {
        play: [pawpsicle],
      },
    );

    const cardUnderTest = testStore.getCard(kuzcoSelfishEmperor);
    const target = testStore.getCard(pawpsicle);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [target] });
    expect(testStore.getZonesCardCount("player_two").inkwell).toEqual(1);
  });
  it("**OUTPLACEMENT** Opt out", () => {
    const testStore = new TestStore(
      {
        inkwell: kuzcoSelfishEmperor.cost,
        hand: [kuzcoSelfishEmperor],
      },
      {
        play: [pawpsicle],
      },
    );

    const cardUnderTest = testStore.getCard(kuzcoSelfishEmperor);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    expect(cardUnderTest.zone).toEqual("play");
    expect(testStore.getZonesCardCount("player_two").inkwell).toEqual(0);
  });
  it("**BY INVITE ONLY** 4 {I} − Your other characters gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_", () => {
    const testStore = new TestStore({
      inkwell: kuzcoSelfishEmperor.cost,
      play: [kuzcoSelfishEmperor, monstroWhaleOfAWhale],
    });

    const cardUnderTest = testStore.getCard(kuzcoSelfishEmperor);
    const monstro = testStore.getCard(monstroWhaleOfAWhale);

    expect(monstro.hasResist).toEqual(false);
    cardUnderTest.activate();
    expect(monstro.hasResist).toEqual(true);
    expect(cardUnderTest.hasResist).toEqual(false);
  });
});
