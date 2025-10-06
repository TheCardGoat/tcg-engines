/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";
import {
  scarMastermind,
  tamatoaSoShiny,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scar Mastermind", () => {
  it("DISARMING Beauty effect - Chosen characters gets -2 {S} this turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: scarMastermind.cost,
        hand: [scarMastermind],
      },
      {
        play: [tamatoaSoShiny],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", scarMastermind.id);
    const target = testStore.getByZoneAndId(
      "play",
      tamatoaSoShiny.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) - 5);
  });
});
