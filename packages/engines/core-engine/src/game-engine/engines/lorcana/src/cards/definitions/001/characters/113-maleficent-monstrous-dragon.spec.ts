/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  maleficentMonstrousDragon,
  moanaOfMotunui,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";

describe("Maleficent Monstrous Dragon", () => {
  it("**Dragon Fire** When you play this character, you may banish chosen character.", () => {
    const testStore = new TestStore({
      inkwell: maleficentMonstrousDragon.cost,
      hand: [maleficentMonstrousDragon],
      play: [moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      maleficentMonstrousDragon.id,
    );
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.playFromHand();

    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("discard");
  });
});
