/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { foodFight } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
import { taffytaMuttonfudgeRuthlessRival } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Food Fight!", () => {
  it("Your characters gain {E}, 1 {I} – Deal 1 damage to chosen character this turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: foodFight.cost,
        hand: [foodFight],
        play: [taffytaMuttonfudgeRuthlessRival],
      },
      {
        deck: 1,
      },
    );

    const target = testStore.getCard(taffytaMuttonfudgeRuthlessRival);
    const cardUnderTest = testStore.getCard(foodFight);

    expect(target.activatedAbilities).toHaveLength(0);
    cardUnderTest.playFromHand();
    expect(target.activatedAbilities).toHaveLength(1);
    testStore.passTurn();
    expect(target.activatedAbilities).toHaveLength(0);
  });
});
