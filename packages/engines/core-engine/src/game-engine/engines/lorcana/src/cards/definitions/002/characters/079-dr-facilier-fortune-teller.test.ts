/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  drFacilierFortuneTeller,
  goofyKnightForADay,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("Dr. Facilier - Fortune Teller", () => {
  it("**YOU'RE IN MY WORLD** Whenever this character quests, chosen opposing character can't quest during their next turn.", () => {
    const testStore = new TestStore(
      {
        play: [drFacilierFortuneTeller],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      drFacilierFortuneTeller.id,
    );

    const target = testStore.getByZoneAndId(
      "play",
      goofyKnightForADay.id,
      "player_two",
    );

    cardUnderTest.quest();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.hasQuestRestriction).toEqual(true);
  });

  it("Evasive", () => {
    const testStore = new TestStore({
      play: [drFacilierFortuneTeller],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      drFacilierFortuneTeller.id,
    );

    expect(cardUnderTest.hasEvasive).toEqual(true);
  });
});
