import { describe, expect, it } from "bun:test";
import {
  liloGalacticHero,
  mauiDemiGod,
  stichtNewDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { madamMimFox } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { madamMimElephant } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import { yzmaConnivingChemist } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Yzma - Conniving Chemist", () => {
  it("**FEEL THE POWER** – _If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand._", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: yzmaConnivingChemist.cost,
        hand: [yzmaConnivingChemist],
        deck: [
          liloGalacticHero,
          stichtNewDog,
          mauiDemiGod,
          madamMimFox,
          madamMimElephant,
        ],
      },
      { deck: 1 },
    );

    const cardUnderTest = testEngine.getCardModel(yzmaConnivingChemist);
    await testEngine.playCard(cardUnderTest);

    expect(testEngine.getZonesCardCount().hand).toBe(0);

    await testEngine.passTurn();

    await testEngine.passTurn();
    await testEngine.activateCard(cardUnderTest);

    expect(testEngine.getZonesCardCount().hand).toBe(3);
  });
});
