/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyMouseTrueFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { cruellaDeVilPerfectlyWretched } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Cruella De Vil - Perfectly Wretched", () => {
  it("**OH, NO YOU DON'T** Whenever this character quests, chosen opposing character gets -2 {S} this turn.", () => {
    const testStore = new TestStore(
      {
        play: [cruellaDeVilPerfectlyWretched],
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      cruellaDeVilPerfectlyWretched.id,
    );
    const target = testStore.getByZoneAndId(
      "play",
      mickeyMouseTrueFriend.id,
      "player_two",
    );

    cardUnderTest.quest();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) - 2);
  });

  it("Shift", () => {
    const testStore = new TestStore({
      play: [cruellaDeVilPerfectlyWretched],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      cruellaDeVilPerfectlyWretched.id,
    );

    expect(cardUnderTest.hasShift).toBe(true);
  });
});
