/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { helgaSinclairVengefulPartner } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Helga Sinclair - Vengeful Partner", () => {
  it.skip("**NOTHING PERSONAL** When this character is challenged and banished, banish the challenging character.", () => {
    const testStore = new TestStore({
      inkwell: helgaSinclairVengefulPartner.cost,
      play: [helgaSinclairVengefulPartner],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      helgaSinclairVengefulPartner.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
