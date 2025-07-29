import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  iWontGiveIn,
  loseTheWay,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lose The Way", () => {
  it("Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: loseTheWay.cost,
        hand: [loseTheWay, iWontGiveIn],
      },
      {
        play: [mickeyBraveLittleTailor],
      },
    );

    await testEngine.playCard(
      loseTheWay,
      {
        targets: [mickeyBraveLittleTailor],
      },
      true,
    );

    expect(testEngine.getCardModel(mickeyBraveLittleTailor).ready).toBe(false);

    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [iWontGiveIn] });
    expect(testEngine.getCardModel(iWontGiveIn).zone).toBe("discard");

    await testEngine.passTurn();
    expect(testEngine.getCardModel(mickeyBraveLittleTailor).ready).toBe(false);
  });
});
