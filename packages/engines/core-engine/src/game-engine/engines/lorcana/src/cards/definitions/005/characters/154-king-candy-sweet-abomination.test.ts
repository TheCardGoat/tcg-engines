/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  kingCandySweetAbomination,
  kronkUnlicensedInvestigator,
  nalaMischievousCub,
  rudyGrooveDisrupter,
  ruttNorthernMoose,
  sleepySluggishKnight,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("King Candy - Sweet Abomination", () => {
  it("Shift", () => {
    const testStore = new TestStore({
      play: [kingCandySweetAbomination],
    });

    const cardUnderTest = testStore.getCard(kingCandySweetAbomination);

    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("**CHANGING THE CODE** When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.", () => {
    const testStore = new TestStore({
      inkwell: kingCandySweetAbomination.cost,
      hand: [kingCandySweetAbomination],
      deck: [
        rudyGrooveDisrupter,
        sleepySluggishKnight,
        kronkUnlicensedInvestigator,
        nalaMischievousCub,
        ruttNorthernMoose,
      ],
    });

    const cardUnderTest = testStore.getCard(kingCandySweetAbomination);
    cardUnderTest.playFromHand();

    testStore.resolveOptionalAbility();
    expect(testStore.getZonesCardCount().hand).toBe(2);

    const target = testStore.getCard(nalaMischievousCub);
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toBe("deck");

    // Checking if the card was not put on top
    testStore.store.drawCard("player_one");
    expect(target.zone).toBe("deck");
  });
});
