/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { belleBookworm } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import {
  baymaxsChargingStation,
  belleMechanicExtraordinaire,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
