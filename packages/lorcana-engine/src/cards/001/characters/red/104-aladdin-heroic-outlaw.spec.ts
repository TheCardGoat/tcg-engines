/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  aladdinHeroicOutlaw,
  heiheiBoatSnack,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Aladdin - Heroic Outlaw", () => {
  it("During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.", () => {
    const testStore = new TestStore(
      {
        play: [aladdinHeroicOutlaw],
        lore: 1,
      },
      {
        play: [heiheiBoatSnack],
        lore: 3,
      },
    );

    const attacker = testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id);
    const defender = testStore.getByZoneAndId(
      "play",
      heiheiBoatSnack.id,
      "player_two",
    );

    expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(1);
    expect(testStore.store.tableStore.getTable("player_two").lore).toEqual(3);

    defender.updateCardMeta({ exerted: true });
    attacker.challenge(defender);

    expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(3);
    expect(testStore.store.tableStore.getTable("player_two").lore).toEqual(1);
  });
});
