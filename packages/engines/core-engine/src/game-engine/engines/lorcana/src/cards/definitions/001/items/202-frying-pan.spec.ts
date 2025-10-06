/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  heiheiBoatSnack,
  teKaTheBurningOne,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { fryingPan } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";

describe("Frying Pan", () => {
  it("**CLANG!** Banish this item - Chosen character can't challenge during their next turn.", () => {
    const testStore = new TestStore(
      {
        play: [fryingPan, heiheiBoatSnack],
      },
      {
        play: [teKaTheBurningOne],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("play", fryingPan.id);
    const attacker = testStore.getByZoneAndId("play", heiheiBoatSnack.id);
    const defender = testStore.getByZoneAndId(
      "play",
      teKaTheBurningOne.id,
      "player_two",
    );

    defender.updateCardMeta({ exerted: true });

    cardUnderTest.activate();

    testStore.resolveTopOfStack({ targetId: attacker.instanceId });

    expect(attacker.canChallenge(defender)).toEqual(false);

    expect(defender.meta.damage).toBeFalsy();
    expect(attacker.meta.damage).toBeFalsy();
    expect(attacker.ready).toBeTruthy();
  });
});
