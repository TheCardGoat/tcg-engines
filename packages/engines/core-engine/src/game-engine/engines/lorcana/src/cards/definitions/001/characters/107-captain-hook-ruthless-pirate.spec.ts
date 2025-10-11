/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  captainHookRecklessPirate,
  goofyDaredevil,
  minniMouseAlwaysClassy,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Captain Hook - Ruthless Pirate", () => {
  it("Rush", () => {
    const testStore = new TestStore({
      play: [captainHookRecklessPirate],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      captainHookRecklessPirate.id,
    );

    expect(cardUnderTest.hasRush).toEqual(true);
  });

  it("**YOU COWARD!** While this character is exerted, opposing characters with **Evasive** gain **Reckless**.", () => {
    const testStore = new TestStore(
      {
        play: [captainHookRecklessPirate],
      },
      {
        play: [goofyDaredevil, minniMouseAlwaysClassy],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      captainHookRecklessPirate.id,
    );
    const opponentWithEvasive = testStore.getByZoneAndId(
      "play",
      goofyDaredevil.id,
      "player_two",
    );
    const opponentWithoutEvasive = testStore.getByZoneAndId(
      "play",
      minniMouseAlwaysClassy.id,
      "player_two",
    );

    expect(opponentWithEvasive.hasEvasive).toEqual(true);
    expect(opponentWithEvasive.hasReckless).toEqual(false);
    expect(opponentWithoutEvasive.hasEvasive).toEqual(false);
    expect(opponentWithoutEvasive.hasReckless).toEqual(false);

    cardUnderTest.updateCardMeta({ exerted: true });

    expect(opponentWithEvasive.hasEvasive).toEqual(true);
    expect(opponentWithEvasive.hasReckless).toEqual(true);
    expect(opponentWithoutEvasive.hasEvasive).toEqual(false);
    expect(opponentWithoutEvasive.hasReckless).toEqual(false);
  });
});
