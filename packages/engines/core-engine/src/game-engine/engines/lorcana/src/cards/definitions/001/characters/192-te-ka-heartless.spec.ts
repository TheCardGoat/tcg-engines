/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  heiheiBoatSnack,
  teKaHeartless,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

export const teKaHeartlessTestCase = () => {
  const testStore = new TestStore(
    {
      play: [teKaHeartless],
    },
    {
      play: [heiheiBoatSnack],
    },
  );

  const attacker = testStore.getByZoneAndId("play", teKaHeartless.id);
  const defender = testStore.getByZoneAndId(
    "play",
    heiheiBoatSnack.id,
    "player_two",
  );

  defender.updateCardMeta({ exerted: true });

  expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
  attacker.challenge(defender);
  expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(2);
};

describe("Te Ka - Heartless", () => {
  it("During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.", () => {
    teKaHeartlessTestCase();
  });
});
