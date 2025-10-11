/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  mickeyBraveLittleTailor,
  pascalRapunzelCompanion,
  rapunzelGiftedWithHealing,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pascal - Rapunzel's Companion", () => {
  describe("**CAMOUFLAGE** While you have another character in play, this character gains **Evasive**. _(Only characters\rwith Evasive can challenge them.)_", () => {
    it("Alone in the battlefield", () => {
      const testStore = new TestStore(
        {
          play: [pascalRapunzelCompanion],
        },
        {
          play: [mickeyBraveLittleTailor],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        pascalRapunzelCompanion.id,
      );

      expect(cardUnderTest.hasEvasive).toEqual(false);
    });

    it("With another characters in play", () => {
      const testStore = new TestStore({
        play: [pascalRapunzelCompanion, rapunzelGiftedWithHealing],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        pascalRapunzelCompanion.id,
      );

      expect(cardUnderTest.hasEvasive).toEqual(true);
    });
  });
});
