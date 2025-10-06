/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { simbaFutureKing } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { mufasaChampionOfThePrideLands } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import { prideLandsPrideRock } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/locations";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pride Lands - Pride Rock", () => {
  it.skip("**WE ARE ALL CONNECTED** Characters get +2 {W} while here.**LION HOME** If you have a Prince or King character here, you pay 1 {I} less to play characters.", () => {
    const testStore = new TestStore({
      inkwell: prideLandsPrideRock.cost,
      play: [prideLandsPrideRock],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      prideLandsPrideRock.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it("**LION HOME** If you have a Prince or King character here, you pay 1 {I} less to play characters.", async () => {
    const testEngine = new TestEngine({
      inkwell:
        prideLandsPrideRock.moveCost + mufasaChampionOfThePrideLands.cost - 1,
      play: [prideLandsPrideRock, simbaFutureKing],
      hand: [mufasaChampionOfThePrideLands],
    });

    const cardToPlayFromHand = testEngine.getCardModel(
      mufasaChampionOfThePrideLands,
    );

    expect(cardToPlayFromHand.cost).toBe(mufasaChampionOfThePrideLands.cost);

    await testEngine.moveToLocation({
      location: prideLandsPrideRock,
      character: simbaFutureKing,
    });

    expect(cardToPlayFromHand.cost).toBe(
      mufasaChampionOfThePrideLands.cost - 1,
    );
  });
});
