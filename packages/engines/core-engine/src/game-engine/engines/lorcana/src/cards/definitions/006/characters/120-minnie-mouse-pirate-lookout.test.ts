/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  jollyRogerHooksShip,
  rlsLegacySolarGalleon,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations";
import {
  goofyFlyingFool,
  kakamoraPiratePitcher,
  mickeyMouseCourageousSailor,
  minnieMousePirateLookout,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Minnie Mouse - Pirate Lookout", () => {
  it("LAND, HO! Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: minnieMousePirateLookout.cost,
      play: [minnieMousePirateLookout],
      hand: [mickeyMouseCourageousSailor, kakamoraPiratePitcher],
      discard: [jollyRogerHooksShip, goofyFlyingFool, rlsLegacySolarGalleon],
    });

    const jollyRoger = testEngine.getCardModel(jollyRogerHooksShip);
    const goofyFlying = testEngine.getCardModel(goofyFlyingFool);
    const rls = testEngine.getCardModel(rlsLegacySolarGalleon);

    expect(testEngine.getCardZone(jollyRoger)).toBe("discard");
    await testEngine.putIntoInkwell(mickeyMouseCourageousSailor);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [jollyRoger] });

    expect(testEngine.getCardZone(rls)).toBe("discard");
    await testEngine.putIntoInkwell(kakamoraPiratePitcher);
    expect(testEngine.stackLayers).toHaveLength(0);
    expect(testEngine.getCardZone(rls)).toBe("discard");

    expect(testEngine.getCardZone(jollyRoger)).toBe("hand");
    expect(testEngine.getCardZone(goofyFlying)).toBe("discard");
  });
});
