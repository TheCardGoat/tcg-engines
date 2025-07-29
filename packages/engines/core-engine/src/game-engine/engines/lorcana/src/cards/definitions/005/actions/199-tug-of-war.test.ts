/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  mickeyBraveLittleTailor,
  simbaProtectiveCub,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { tugofwar } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

describe("Tug-of-War", () => {
  it("Choose one: Deal 1 damage to each opposing character without **Evasive**. Deal 3 damage to each opposing character with **Evasive**.", () => {
    const testStore = new TestStore(
      {
        inkwell: tugofwar.cost,
        hand: [tugofwar],
      },
      {
        play: [mickeyBraveLittleTailor, simbaProtectiveCub],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", tugofwar.id);
    const target1 = testStore.getByZoneAndId(
      "play",
      mickeyBraveLittleTailor.id,
      "player_two",
    );
    const target2 = testStore.getByZoneAndId(
      "play",
      simbaProtectiveCub.id,
      "player_two",
    );

    expect(target1.damage).toBe(0);
    expect(target2.damage).toBe(0);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ mode: "1" }); // Choose first mode - 1 damage to characters without Evasive

    // Test that 1 damage was dealt to characters without Evasive (Simba doesn't have Evasive)
    expect(target2.damage).toBe(1); // Simba should take damage
    expect(testStore.getZonesCardCount().discard).toBe(1); // Tug-of-War goes to discard
  });
});
