import { describe, expect, it } from "bun:test";
import { gruesomeAndGrim } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { drFacilierSavvyOpportunist } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gruesome And Grim", () => {
  it("Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _(They can challenge the turn they're played.)_", () => {
    const testStore = new TestStore(
      {
        inkwell: gruesomeAndGrim.cost,
        hand: [gruesomeAndGrim, drFacilierSavvyOpportunist],
      },
      {
        deck: 2,
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", gruesomeAndGrim.id);
    const target = testStore.getByZoneAndId(
      "hand",
      drFacilierSavvyOpportunist.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] }, true);

    expect(target.zone).toEqual("play");
    expect(target.hasRush).toEqual(true);

    testStore.passTurn();

    expect(target.zone).toEqual("discard");
  });
});
