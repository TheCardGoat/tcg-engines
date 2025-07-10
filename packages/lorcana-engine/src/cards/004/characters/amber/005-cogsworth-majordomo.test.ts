/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { tamatoaSoShiny } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { cogsworthMajordomo } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Cogsworth - Majordomo", () => {
  it("AS YOU WERE! Whenever this character quests, you may give chosen character -2 {S} until the start of your next turn.", async () => {
    const testEngine = new TestEngine(
      {
        play: [cogsworthMajordomo],
        deck: 10,
      },
      {
        play: [tamatoaSoShiny],
        deck: 10,
      },
    );

    expect(testEngine.getCardModel(tamatoaSoShiny).strength).toBe(
      tamatoaSoShiny.strength,
    );

    await testEngine.questCard(cogsworthMajordomo);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack(
      {
        targets: [tamatoaSoShiny],
      },
      true,
    );

    expect(testEngine.getCardModel(tamatoaSoShiny).strength).toBe(
      tamatoaSoShiny.strength - 2,
    );

    await testEngine.passTurn();

    expect(testEngine.getCardModel(tamatoaSoShiny).strength).toBe(
      tamatoaSoShiny.strength - 2,
    );

    await testEngine.passTurn();

    expect(testEngine.getCardModel(tamatoaSoShiny).strength).toBe(
      tamatoaSoShiny.strength,
    );
  });
});
