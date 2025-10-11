import { describe, expect, it } from "bun:test";
import { tipoGrowingSon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  chacaJuniorChipmunk,
  deweyLovableShowoff,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Chaca - Junior Chipmunk", () => {
  it("IN CAHOOTS When you play this character, if you have a character named Tipo in play, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: chacaJuniorChipmunk.cost,
        hand: [chacaJuniorChipmunk],
        play: [tipoGrowingSon],
      },
      {
        play: [deweyLovableShowoff],
      },
    );

    const targetReckless = testEngine.getCardModel(deweyLovableShowoff);

    await testEngine.playCard(chacaJuniorChipmunk);

    await testEngine.resolveTopOfStack({ targets: [targetReckless] });

    expect(targetReckless.hasReckless()).toBe(false);

    await testEngine.passTurn();

    expect(targetReckless.hasReckless()).toBe(true);
  });
});
