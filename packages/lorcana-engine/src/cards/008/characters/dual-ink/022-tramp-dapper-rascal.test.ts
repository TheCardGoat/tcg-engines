/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { monstroWhaleOfAWhale } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import {
  deweyLovableShowoff,
  trampDapperRascal,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Tramp - Dapper Rascal", () => {
  it.skip("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Tramp.)", async () => {
    const testEngine = new TestEngine({
      play: [trampDapperRascal],
    });

    const cardUnderTest = testEngine.getCardModel(trampDapperRascal);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("PLAY IT COOL During an opponent’s turn, whenever one of your characters is banished, you may draw a card.", async () => {
    const testEngine = new TestEngine(
      {
        play: [trampDapperRascal, deweyLovableShowoff],
      },
      {
        play: [monstroWhaleOfAWhale],
      },
    );

    const attacker = testEngine.getCardModel(monstroWhaleOfAWhale);
    // const cardUnderTest = testEngine.getCardModel(trampDapperRascal);
    const cardToBanish = testEngine.getCardModel(deweyLovableShowoff);

    testEngine.questCard(cardToBanish);

    await testEngine.passTurn();

    await testEngine.challenge({
      attacker: attacker,
      defender: cardToBanish,
    });

    testEngine.changeActivePlayer();
    await testEngine.resolveOptionalAbility();

    testEngine.getCardsByZone("hand", "player_one");
    // await testEngine.resolveTopOfStack({});
  });
});
