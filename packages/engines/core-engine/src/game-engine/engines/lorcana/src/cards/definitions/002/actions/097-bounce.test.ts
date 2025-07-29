import { describe, expect, it } from "bun:test";
import { liloGalacticHero } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { bounce } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { cinderellaBallroomSensation } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Bounce", () => {
  it("Return chosen character of yours to your hand to return another chosen character to their player's hand.", () => {
    const testStore = new TestStore(
      {
        inkwell: bounce.cost,
        hand: [bounce],
        play: [cinderellaBallroomSensation],
      },
      {
        play: [liloGalacticHero],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", bounce.id);
    const target = testStore.getByZoneAndId(
      "play",
      cinderellaBallroomSensation.id,
    );
    const opponentTarget = testStore.getByZoneAndId(
      "play",
      liloGalacticHero.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] }, true);
    testStore.resolveTopOfStack({ targets: [opponentTarget] });

    expect(target.zone).toEqual("hand");
    expect(opponentTarget.zone).toEqual("hand");
  });
});
