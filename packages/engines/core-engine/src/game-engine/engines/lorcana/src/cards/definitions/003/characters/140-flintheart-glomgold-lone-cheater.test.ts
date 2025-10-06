/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { flintheartGlomgoldLoneCheater } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
