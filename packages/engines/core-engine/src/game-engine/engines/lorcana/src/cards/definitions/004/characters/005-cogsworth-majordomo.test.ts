/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { tamatoaSoShiny } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { cogsworthMajordomo } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
