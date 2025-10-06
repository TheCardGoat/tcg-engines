/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { ladyTremaineOverbearingMatriarch } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

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
