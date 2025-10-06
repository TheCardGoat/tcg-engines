/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { mickeyMouseStandardBearer } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Mickey Mouse - Standard Bearer", () => {
  it("**BE STRONG** When you play this character, chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: mickeyMouseStandardBearer.cost,
      hand: [mickeyMouseStandardBearer],
      play: [goofyKnightForADay],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMouseStandardBearer);
    const target = testEngine.getCardModel(goofyKnightForADay);

    await testEngine.playCard(cardUnderTest);
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.hasChallenger).toBe(true);
  });
});
