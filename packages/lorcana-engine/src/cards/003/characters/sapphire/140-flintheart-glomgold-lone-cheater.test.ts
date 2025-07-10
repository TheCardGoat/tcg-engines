/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { flintheartGlomgoldLoneCheater } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Flintheart Glomgold - Lone Cheater", () => {
  it.skip("**THEY'LL NEVER SEE IT COMING!** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_", () => {
    const testStore = new TestStore({
      inkwell: flintheartGlomgoldLoneCheater.cost,
      play: [flintheartGlomgoldLoneCheater],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      flintheartGlomgoldLoneCheater.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
