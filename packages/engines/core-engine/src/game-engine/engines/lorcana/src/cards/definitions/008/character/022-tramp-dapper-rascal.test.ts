import { describe, expect, it } from "bun:test";
import { monstroWhaleOfAWhale } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  deweyLovableShowoff,
  trampDapperRascal,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tramp - Dapper Rascal", () => {
  it.skip("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Tramp.)", async () => {
    const testEngine = new TestEngine({
      play: [trampDapperRascal],
    });

    const cardUnderTest = testEngine.getCardModel(trampDapperRascal);
    expect(cardUnderTest.hasShift()).toBe(true);
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
