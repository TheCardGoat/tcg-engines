/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  hadesMeticulousPlotter,
  tukTukCuriousPartner,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { ursulasGardenFullOfTheUnfortunate } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Ursula's Garden - Full of the Unfortunate", () => {
  it("**Abandon Hope** While you have an exerted character here, opposing characters get -1 {L}.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: ursulasGardenFullOfTheUnfortunate.moveCost,
        play: [ursulasGardenFullOfTheUnfortunate, tukTukCuriousPartner],
      },
      {
        play: [hadesMeticulousPlotter],
      },
    );

    const targetCard = testEngine.getCardModel(hadesMeticulousPlotter);

    await testEngine.moveToLocation({
      location: ursulasGardenFullOfTheUnfortunate,
      character: tukTukCuriousPartner,
    });

    expect(targetCard.lore).toEqual(hadesMeticulousPlotter.lore);
    await testEngine.tapCard(tukTukCuriousPartner);
    expect(targetCard.lore).toEqual(hadesMeticulousPlotter.lore - 1);
  });
});
