/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { namaariResoluteDaughter } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Namaari - Resolute Daughter", () => {
  it.skip("**I DON’T HAVE ANY OTHER CHOICE** For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character.<br/>**Resist** +3 _(Damage dealt to this character is reduced by 3.)_", () => {
    const testStore = new TestStore({
      inkwell: namaariResoluteDaughter.cost,
      play: [namaariResoluteDaughter],
    });

    const cardUnderTest = testStore.getCard(namaariResoluteDaughter);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
