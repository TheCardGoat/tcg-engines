/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mulanImperialSoldier } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { scuttleExpertOnHumans } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { medallionWeights } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Medallion Weights", () => {
  it("**DISCIPLINE AND STRENGTH** {E}, 2 {I} - Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.", () => {
    const testStore = new TestStore(
      {
        inkwell: medallionWeights.cost + 2,
        play: [medallionWeights, mulanImperialSoldier],
        deck: 1,
      },
      {
        play: [scuttleExpertOnHumans],
      },
    );

    const cardUnderTest = testStore.getCard(medallionWeights);
    const target = testStore.getCard(mulanImperialSoldier);
    const opponent = testStore.getCard(scuttleExpertOnHumans);

    opponent.updateCardMeta({ exerted: true });

    const initialStrength = target.strength;
    const initialHandSize = testStore.getZonesCardCount().hand;

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toBe(initialStrength + 2);

    // Simulate a challenge with Scuttle as the opponent
    target.challenge(opponent);
    testStore.resolveOptionalAbility();

    expect(testStore.getZonesCardCount().hand).toBe(initialHandSize + 1);

    testStore.passTurn();

    expect(target.strength).toBe(initialStrength);
  });
});
