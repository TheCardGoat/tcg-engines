/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import { nickWildeWilyFox } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";

describe("Nick Wilde - Wily Fox", () => {
  describe("**IT'S CALLED A HUSTLE** When you play this character, you may return an item card named Pawpsicle from your discard to your hand.", () => {
    it("should return Pawpsicle from discard to hand", () => {
      const testStore = new TestStore({
        inkwell: nickWildeWilyFox.cost,
        hand: [nickWildeWilyFox],
        discard: [pawpsicle],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        nickWildeWilyFox.id,
      );
      const target = testStore.getByZoneAndId("discard", pawpsicle.id);

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toBe("hand");
    });

    it("should NOT return any item from discard to hand", () => {
      const testStore = new TestStore({
        inkwell: nickWildeWilyFox.cost,
        hand: [nickWildeWilyFox],
        discard: [dingleHopper],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        nickWildeWilyFox.id,
      );
      const target = testStore.getByZoneAndId("discard", dingleHopper.id);

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      // At this point the engine will realise there's no valid target and won't add the ability to the stack
      // testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toBe("discard");
    });
  });
});
