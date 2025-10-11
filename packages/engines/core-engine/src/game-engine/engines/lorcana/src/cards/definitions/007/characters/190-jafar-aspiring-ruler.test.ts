import { describe, expect, it } from "bun:test";
import { goonsMaleficent } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { jafarAspiringRuler } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
