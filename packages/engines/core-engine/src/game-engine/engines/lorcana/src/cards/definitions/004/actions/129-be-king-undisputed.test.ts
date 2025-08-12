import { describe, expect, it } from "bun:test";
import { princeJohnGreediestOfAll } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { beKingUndisputed } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { magicBroomLivelySweeper } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Be King Undisputed", () => {
  it("Each opponent chooses and banishes one of their characters.", () => {
    const testStore = new TestStore(
      {
        inkwell: beKingUndisputed.cost,
        hand: [beKingUndisputed],
      },
      {
        play: [magicBroomLivelySweeper],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", beKingUndisputed.id);
    const target = testStore.getByZoneAndId(
      "play",
      magicBroomLivelySweeper.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.changePlayer("player_two");
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toBe("discard");
  });

  it("Only targetable character has ward", () => {
    const testStore = new TestStore(
      {
        inkwell: beKingUndisputed.cost,
        hand: [beKingUndisputed],
      },
      {
        play: [princeJohnGreediestOfAll],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", beKingUndisputed.id);
    const target = testStore.getByZoneAndId(
      "play",
      princeJohnGreediestOfAll.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.changePlayer("player_two");
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toBe("discard");
  });
});
