/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  bagheeraGuardianJaguar,
  cardSoldiersRoyalTroops,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Card Soldiers - Royal Troops", () => {
  it("TAKE POINT While a damaged character is in play, this character gets +2 {S}.", async () => {
    const testEngine = new TestEngine(
      {
        play: [cardSoldiersRoyalTroops],
      },
      {
        play: [bagheeraGuardianJaguar],
      },
    );

    expect(testEngine.getCardModel(cardSoldiersRoyalTroops).strength).toBe(
      cardSoldiersRoyalTroops.strength,
    );

    await testEngine.setCardDamage(bagheeraGuardianJaguar, 1);

    expect(testEngine.getCardModel(cardSoldiersRoyalTroops).strength).toBe(
      cardSoldiersRoyalTroops.strength + 2,
    );
  });
});
