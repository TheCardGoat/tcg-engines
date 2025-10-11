import { describe, expect, it } from "bun:test";
import { scroogeMcduckRichestDuckInTheWorld } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { luckyDime } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items";
import { tipoGrowingSon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scrooge McDuck - Richest Duck in the World", () => {
  it("**I DIDN'T GET RICH BY BEING STUPID** During your turn, whenever this character banishes another character in a challenge, you may play an item for free.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: scroogeMcduckRichestDuckInTheWorld.cost,
        play: [scroogeMcduckRichestDuckInTheWorld],
        hand: [luckyDime],
      },
      {
        play: [tipoGrowingSon],
      },
    );

    const scrooge = testEngine.getCardModel(scroogeMcduckRichestDuckInTheWorld);
    const tipo = testEngine.getCardModel(tipoGrowingSon);
    const dime = testEngine.getCardModel(luckyDime);

    tipo.updateCardMeta({ exerted: true });
    scrooge.challenge(tipo);
    expect(testEngine.stackLayers).toHaveLength(1);
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [dime] });

    expect(testEngine.getZonesCardCount().hand).toEqual(0);
    expect(testEngine.getCardZone(luckyDime)).toBe("play");
  });
});
