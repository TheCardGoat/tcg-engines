/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { jimHawkinsSpaceTraveler } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import {
  prideLandsJungleOasis,
  rapunzelsTowerSecludedPrison,
} from "@lorcanito/lorcana-engine/cards/005/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Jim Hawkins - Space Traveler", () => {
  it("**THIS IS IT!** When you play this character, you may play a location with cost 4 or less for free.", () => {
    const testStore = new TestStore({
      inkwell: jimHawkinsSpaceTraveler.cost,
      hand: [jimHawkinsSpaceTraveler, rapunzelsTowerSecludedPrison],
    });

    const cardUnderTest = testStore.getCard(jimHawkinsSpaceTraveler);
    const targetLocation = testStore.getCard(rapunzelsTowerSecludedPrison);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [targetLocation] }, true);
    testStore.resolveOptionalAbility();
    expect(targetLocation.zone).toBe("play");
    expect(cardUnderTest.isAtLocation(targetLocation)).toBe(true);
  });

  it("**TAKE THE HELM** Whenever you play a location, this character may move there for free.", () => {
    const testStore = new TestStore({
      inkwell: rapunzelsTowerSecludedPrison.cost,
      hand: [rapunzelsTowerSecludedPrison],
      play: [jimHawkinsSpaceTraveler, prideLandsJungleOasis],
    });

    const cardUnderTest = testStore.getCard(jimHawkinsSpaceTraveler);
    const targetLocation = testStore.getCard(rapunzelsTowerSecludedPrison);

    targetLocation.playFromHand();
    testStore.resolveOptionalAbility();
    expect(cardUnderTest.isAtLocation(targetLocation)).toBe(true);
  });
});
