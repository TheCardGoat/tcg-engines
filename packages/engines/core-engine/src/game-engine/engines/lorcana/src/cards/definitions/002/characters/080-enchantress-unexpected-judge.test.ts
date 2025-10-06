/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  enchantressUnexpectedJudge,
  goofyKnightForADay,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Enchantress - Unexpected Judge", () => {
  it("**TRUE FORM** While being challenged, this character gets +2 {S}.", () => {
    const testStore = new TestStore(
      {
        play: [goofyKnightForADay],
      },
      {
        play: [enchantressUnexpectedJudge],
      },
    );

    const challenger = testStore.getByZoneAndId("play", goofyKnightForADay.id);
    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      enchantressUnexpectedJudge.id,
      "player_two",
    );
    cardUnderTest.updateCardMeta({ exerted: true });

    challenger.challenge(cardUnderTest);

    expect(challenger.damage).toEqual(enchantressUnexpectedJudge.strength + 2);
  });
});
