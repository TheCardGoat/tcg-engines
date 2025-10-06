/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  kenaiProtectiveBrother,
  wreckitRalphHerosDuty,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kenai - Protective Brother", () => {
  it("HE NEEDS ME At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.", async () => {
    const testEngine = new TestEngine(
      {
        play: [kenaiProtectiveBrother, wreckitRalphHerosDuty],
      },
      {
        deck: 7,
      },
    );

    await testEngine.setCardDamage(
      wreckitRalphHerosDuty,
      wreckitRalphHerosDuty.willpower - 1,
    );
    await testEngine.tapCard(wreckitRalphHerosDuty);
    await testEngine.tapCard(kenaiProtectiveBrother);

    await testEngine.passTurn();
    testEngine.changeActivePlayer("player_one");
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({
      targets: [wreckitRalphHerosDuty],
    });

    const cardModel = testEngine.getCardModel(wreckitRalphHerosDuty);
    expect(cardModel.damage).toBe(0);
    expect(cardModel.exerted).toBe(false);
  });
});
