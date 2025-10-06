/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { princeNaveenPennilessRoyal } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { croquetMallet } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";

describe("Croquet Mallet", () => {
  it("**HURTLING HEDGEHOG** Banish this item − Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_", () => {
    const testStore = new TestStore({
      inkwell: croquetMallet.cost,
      play: [croquetMallet, princeNaveenPennilessRoyal],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", croquetMallet.id);
    const target = testStore.getByZoneAndId(
      "play",
      princeNaveenPennilessRoyal.id,
    );

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.hasRush).toEqual(true);
    expect(cardUnderTest.zone).toEqual("discard");
  });
});
