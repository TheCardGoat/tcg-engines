/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arthurWizardsApprentice,
  chipTheTeacupGentleSoul,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Arthur - Wizard's Apprentice", () => {
  describe("**STUDENT** Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.", () => {
    it("returning character to hand should give 2 lore", () => {
      const testStore = new TestStore({
        inkwell: arthurWizardsApprentice.cost,
        play: [arthurWizardsApprentice, chipTheTeacupGentleSoul],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        arthurWizardsApprentice.id,
      );
      const target = testStore.getByZoneAndId(
        "play",
        chipTheTeacupGentleSoul.id,
      );

      cardUnderTest.quest();
      testStore.resolveOptionalAbility();
      expect(testStore.stackLayers).toHaveLength(1);

      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toBe("hand");
      expect(testStore.store.tableStore.getTable().lore).toBe(
        2 + arthurWizardsApprentice.lore,
      );
    });

    it("Not returning character to hand should NOT give 2 lore", () => {
      const testStore = new TestStore({
        inkwell: arthurWizardsApprentice.cost,
        play: [arthurWizardsApprentice, chipTheTeacupGentleSoul],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        arthurWizardsApprentice.id,
      );
      const target = testStore.getByZoneAndId(
        "play",
        chipTheTeacupGentleSoul.id,
      );

      cardUnderTest.quest();
      testStore.skipOptionalAbility();

      expect(target.zone).toBe("play");
      expect(cardUnderTest.zone).toBe("play");
      expect(testStore.store.tableStore.getTable().lore).toBe(
        arthurWizardsApprentice.lore,
      );
    });
  });
});
