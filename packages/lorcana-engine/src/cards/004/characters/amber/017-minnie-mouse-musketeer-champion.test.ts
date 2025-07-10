/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  minnieMouseMusketeerChampion,
  sisuEmpoweredSibling,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Minnie Mouse - Musketeer Champion", () => {
  it("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your character must chose one with Bodyguard if able.)", () => {
    const testStore = new TestStore({
      play: [minnieMouseMusketeerChampion],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      minnieMouseMusketeerChampion.id,
    );
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });

  it("**DRAMATIC ENTERANCE** When you play this character, banish chosen opposing character with 5  {S} or more.", () => {
    const testStore = new TestStore(
      {
        inkwell: minnieMouseMusketeerChampion.cost,
        hand: [minnieMouseMusketeerChampion],
      },
      { play: [sisuEmpoweredSibling] },
    );
    const cardUnderTest = testStore.getCard(minnieMouseMusketeerChampion);
    const target = testStore.getCard(sisuEmpoweredSibling);

    cardUnderTest.playFromHand({ bodyguard: true });
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
  });
});
