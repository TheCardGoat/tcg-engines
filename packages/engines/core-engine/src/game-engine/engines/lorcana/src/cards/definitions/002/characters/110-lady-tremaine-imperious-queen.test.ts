/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  fidgetRatigansHenchman,
  ladyTremaineImperiousQueen,
  princeJohnGreediestOfAll,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lady Tremaine - Imperious Queen", () => {
  it("Shift", () => {
    const testStore = new TestStore({
      play: [ladyTremaineImperiousQueen],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      ladyTremaineImperiousQueen.id,
    );

    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("**POWER TO RULE AT LAST** When you play this character, each opponent chooses and banishes one of their characters.", () => {
    const testStore = new TestStore(
      {
        inkwell: ladyTremaineImperiousQueen.cost,
        hand: [ladyTremaineImperiousQueen],
      },
      {
        play: [fidgetRatigansHenchman],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      ladyTremaineImperiousQueen.id,
    );
    const target = testStore.getByZoneAndId(
      "play",
      fidgetRatigansHenchman.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.changePlayer().resolveTopOfStack({ targets: [target] });

    expect(target.zone).toBe("discard");
  });
  it("Opponent being able to choose their own character with ward.", () => {
    const testStore = new TestStore(
      {
        inkwell: ladyTremaineImperiousQueen.cost,
        hand: [ladyTremaineImperiousQueen],
      },
      {
        play: [princeJohnGreediestOfAll],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      ladyTremaineImperiousQueen.id,
    );
    const target = testStore.getByZoneAndId(
      "play",
      princeJohnGreediestOfAll.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.changePlayer().resolveTopOfStack({ targets: [target] });

    expect(target.zone).toBe("discard");
  });
});
