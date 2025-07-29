import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { brunosReturn } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe.skip("Bruno's Return", () => {
  it("Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.", () => {
    const testStore = new TestStore({
      inkwell: brunosReturn.cost,
      hand: [brunosReturn],
      discard: [mickeyBraveLittleTailor],
      play: [mickeyBraveLittleTailor],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", brunosReturn.id);
    const characterInDiscard = testStore.getByZoneAndId(
      "discard",
      mickeyBraveLittleTailor.id,
    );
    const characterInPlay = testStore.getByZoneAndId(
      "play",
      mickeyBraveLittleTailor.id,
    );

    // Add damage to the character in play
    characterInPlay.updateCardDamage(2);

    cardUnderTest.playFromHand();

    // With resolveEffectsIndividually, the effects are resolved in the order they appear on the stack
    // First resolve the heal effect (top of stack)
    testStore.resolveTopOfStack(
      {
        targets: [characterInPlay],
      },
      true,
    );

    // Then resolve the move effect (next on stack)
    testStore.resolveTopOfStack({
      targets: [characterInDiscard],
    });

    expect(testStore.getZonesCardCount().hand).toBe(1); // character returned to hand
    expect(testStore.getZonesCardCount().discard).toBe(1); // Bruno's Return goes to discard
    expect(characterInDiscard.zone).toBe("hand");
    expect(characterInPlay.meta.damage).toBe(0); // damage removed
  });
});
