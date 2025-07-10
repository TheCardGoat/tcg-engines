/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { cruellaDeVilPerfectlyWretched } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
