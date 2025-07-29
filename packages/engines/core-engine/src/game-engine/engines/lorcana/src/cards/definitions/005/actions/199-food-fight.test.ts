/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { taffytaMuttonfudgeRuthlessRival } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { foodFight } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

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
