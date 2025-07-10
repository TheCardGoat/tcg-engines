/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { ladyTremaineOverbearingMatriarch } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Lady Tremaine - Overbearing Matriarch", () => {
  it("**NOT FOR YOU** When you play this character, each opponent with more lore than you loses 1 lore.", () => {
    const testStore = new TestStore(
      {
        inkwell: ladyTremaineOverbearingMatriarch.cost,
        hand: [ladyTremaineOverbearingMatriarch],
        lore: 1,
      },
      {
        lore: 3,
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      ladyTremaineOverbearingMatriarch.id,
    );

    cardUnderTest.playFromHand();

    expect(testStore.getPlayerLore("player_two")).toEqual(2);
  });
});
