/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { jafarAspiringRuler } from "@lorcanito/lorcana-engine/cards/007";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Jafar - Aspiring Ruler", () => {
  it("THAT'S BETTER When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
    const testStore = new TestStore({
      inkwell: jafarAspiringRuler.cost,
      hand: [jafarAspiringRuler],
      play: [goonsMaleficent],
    });

    const cardUnderTest = testStore.getCard(jafarAspiringRuler);
    const target = testStore.getCard(goonsMaleficent);
    expect(target.hasChallenger).toEqual(false);
    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });
    expect(target.hasChallenger).toEqual(true);
  });
});
