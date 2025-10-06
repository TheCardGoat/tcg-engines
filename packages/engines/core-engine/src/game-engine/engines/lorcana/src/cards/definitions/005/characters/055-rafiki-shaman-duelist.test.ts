/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { rafikiShamanDuelist } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Rafiki - Shaman Duelist", () => {
  it("**SURPRISING SKILL** When you play this character, he gains **Challenger** +4 this turn. _(They get +4 while challenging.)_", () => {
    const testStore = new TestStore({
      inkwell: rafikiShamanDuelist.cost,
      hand: [rafikiShamanDuelist],
    });

    const cardUnderTest = testStore.getCard(rafikiShamanDuelist);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({});
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
