/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloMakingAWish } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { tukTukLivelyPartner } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  rapunzelsTowerSecludedPrison,
  sevenDwarfsMineSecureFortress,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tuk Tuk - Lively Partner", () => {
  it("**ON A ROLL** When you play this character, you may move him and one of your other characters to the same location for free. The other character gets +2 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: tukTukLivelyPartner.cost,
      hand: [tukTukLivelyPartner],
      play: [rapunzelsTowerSecludedPrison, liloMakingAWish],
    });

    const cardUnderTest = testEngine.getCardModel(tukTukLivelyPartner);
    const locationUnderTest = testEngine.getCardModel(
      rapunzelsTowerSecludedPrison,
    );
    const targetCharacterUnderTest = testEngine.getCardModel(liloMakingAWish);

    await testEngine.playCard(tukTukLivelyPartner);
    await testEngine.resolveOptionalAbility();

    await testEngine.resolveTopOfStack(
      { targets: [targetCharacterUnderTest] },
      true,
    );
    await testEngine.resolveTopOfStack({ targets: [locationUnderTest] }, true);

    expect(targetCharacterUnderTest.isAtLocation(locationUnderTest)).toBe(true);
    expect(cardUnderTest.isAtLocation(locationUnderTest)).toBe(true);
    expect(targetCharacterUnderTest.strength).toBe(
      liloMakingAWish.strength + 2,
    );
  });
});

describe("Regression", () => {
  it("Should be able to enter the mines", async () => {
    const testEngine = new TestEngine({
      inkwell: sevenDwarfsMineSecureFortress.moveCost,
      play: [tukTukLivelyPartner, sevenDwarfsMineSecureFortress],
    });

    const { location, character } = await testEngine.moveToLocation({
      location: sevenDwarfsMineSecureFortress,
      character: tukTukLivelyPartner,
    });

    expect(character.isAtLocation(location)).toBe(true);
    expect(location.containsCharacter(character)).toBe(true);
  });
});
