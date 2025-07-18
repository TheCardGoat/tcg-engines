/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  heiheiBoatSnack,
  teKaHeartless,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
