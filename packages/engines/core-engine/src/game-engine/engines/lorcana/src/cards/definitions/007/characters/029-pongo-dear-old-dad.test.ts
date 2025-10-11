import { describe, expect, it } from "bun:test";
import {
  frecklesGoodBoy,
  luckyRuntOfTheLitter,
  perditaPlayfulMother,
  pongoDearOldDad,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pongo - Dear Old Dad", () => {
  it("FOUND YOU, YOU LITTLE RASCAL At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.", async () => {
    const testEngine = new TestEngine(
      {},
      {
        inkwell: [frecklesGoodBoy, perditaPlayfulMother, luckyRuntOfTheLitter],
        play: [pongoDearOldDad],
        hand: [pongoDearOldDad],
      },
    );

    await testEngine.passTurn();
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [luckyRuntOfTheLitter] });

    expect(testEngine.getCardModel(luckyRuntOfTheLitter).zone).toBe("play");
  });
});
