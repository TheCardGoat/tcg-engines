/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  heiheiBoatSnack,
  simbaRightfulHeir,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";

describe("Simba - Rightful Heir", () => {
  it("**I KNOW WHAT I HAVE TO DO** During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.", () => {
    const testStore = new TestStore(
      {
        play: [simbaRightfulHeir],
      },
      {
        play: [heiheiBoatSnack],
      },
    );

    const attacker = testStore.getByZoneAndId("play", simbaRightfulHeir.id);
    const defender = testStore.getByZoneAndId(
      "play",
      heiheiBoatSnack.id,
      "player_two",
    );

    defender.updateCardMeta({ exerted: true });

    expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
    attacker.challenge(defender);
    expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(1);
  });
});
