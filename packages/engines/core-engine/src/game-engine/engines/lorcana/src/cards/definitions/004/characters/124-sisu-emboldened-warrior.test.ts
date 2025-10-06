/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { sisuEmboldenedWarrior } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sisu - Emboldened Warrior", () => {
  it("**SURGE OF POWER** This character gets +1 {S} for each card in opponent's hands.", () => {
    const testStore = new TestStore(
      {
        inkwell: sisuEmboldenedWarrior.cost,
        play: [sisuEmboldenedWarrior],
      },
      {
        hand: [
          sisuEmboldenedWarrior,
          sisuEmboldenedWarrior,
          sisuEmboldenedWarrior,
        ],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      sisuEmboldenedWarrior.id,
    );

    expect(cardUnderTest.strength).toEqual(
      sisuEmboldenedWarrior.strength +
        testStore.getZonesCardCount("player_two").hand,
    );
  });
});
