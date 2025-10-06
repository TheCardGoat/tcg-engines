/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  hadesMeticulousPlotter,
  tukTukCuriousPartner,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { ursulasGardenFullOfTheUnfortunate } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/locations";

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
