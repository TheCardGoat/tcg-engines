/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { vanellopeVonSchweetzRandomRosterRacer } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Vanellope von Schweetz - Random Roster Racer", () => {
  it("**PIXLEXIA** When you play this character, she gains **Evasive** until the start of your next turn. _(Only characters with Evasive can challenge them.)_", () => {
    const testStore = new TestStore({
      inkwell: vanellopeVonSchweetzRandomRosterRacer.cost,
      hand: [vanellopeVonSchweetzRandomRosterRacer],
    });

    const cardUnderTest = testStore.getCard(
      vanellopeVonSchweetzRandomRosterRacer,
    );
    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({});

    expect(cardUnderTest.hasEvasive).toEqual(true);

    testStore.passTurn();

    expect(cardUnderTest.hasEvasive).toEqual(true);

    testStore.passTurn();

    expect(cardUnderTest.hasEvasive).toEqual(false);
  });
});
