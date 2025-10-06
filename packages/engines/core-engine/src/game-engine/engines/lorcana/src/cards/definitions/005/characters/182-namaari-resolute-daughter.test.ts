/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { namaariResoluteDaughter } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

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
