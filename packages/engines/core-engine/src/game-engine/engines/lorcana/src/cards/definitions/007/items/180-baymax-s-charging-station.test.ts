import { describe, expect, it } from "bun:test";
import { belleBookworm } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import {
  baymaxsChargingStation,
  belleMechanicExtraordinaire,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Baymax's Charging Station", () => {
  it("ENERGY CONVERTER Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      deck: 2,
      inkwell: belleMechanicExtraordinaire.cost + belleBookworm.cost,
      play: [baymaxsChargingStation],
      hand: [belleMechanicExtraordinaire, belleBookworm],
    });

    await testEngine.playCard(belleBookworm);
    expect(testEngine.stackLayers.length).toBe(0);

    await testEngine.shiftCard({
      shifter: belleMechanicExtraordinaire,
      shifted: belleBookworm,
    });
    expect(testEngine.stackLayers.length).toBe(1);

    await testEngine.resolveOptionalAbility();

    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 1,
      }),
    );
  });
});
