/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { bounce } from "@lorcanito/lorcana-engine/cards/002/actions/actions.ts";
import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
