import { describe, expect, it } from "bun:test";
import { charge } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Charge", () => {
  it("Chosen character gains **Challenger** +2 and **Resist** +2 this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_", () => {
    const testStore = new TestStore({
      inkwell: charge.cost,
      hand: [charge],
      play: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", charge.id);
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.hasChallenger).toBe(true);
    expect(target.hasResist).toBe(true);

    testStore.passTurn();

    expect(target.hasChallenger).toBe(false);
    expect(target.hasResist).toBe(false);
  });
});
