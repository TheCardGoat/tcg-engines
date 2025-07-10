/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { heiheiPersistenetPresenceTestCases } from "@lorcanito/lorcana-engine/cards/002/characters/amethyst/043-heihei-persistent-presence.test";
import {
  chipTheTeacupGentleSoul,
  heiheiPersistentPresence,
  ladyTremaineOverbearingMatriarch,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("'When this character is banished in a challenge' trigger", () => {
  it("should not return to hand when ANOTHER CHARACTER banished in a challenge", () => {
    const testStore = new TestStore(
      {
        play: [heiheiPersistentPresence, ladyTremaineOverbearingMatriarch],
      },
      {
        play: [chipTheTeacupGentleSoul],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      heiheiPersistentPresence.id,
    );
    const attacker = testStore.getCard(ladyTremaineOverbearingMatriarch);
    const defender = testStore.getByZoneAndId(
      "play",
      chipTheTeacupGentleSoul.id,
      "player_two",
    );

    expect(cardUnderTest.zone).toEqual("play");
    expect(defender.zone).toEqual("play");
    expect(attacker.zone).toEqual("play");

    defender.updateCardMeta({ exerted: true });
    attacker.challenge(defender);

    expect(cardUnderTest.zone).toEqual("play");
    expect(defender.zone).toEqual("discard");
    expect(attacker.zone).toEqual("discard");
  });

  heiheiPersistenetPresenceTestCases();
});
