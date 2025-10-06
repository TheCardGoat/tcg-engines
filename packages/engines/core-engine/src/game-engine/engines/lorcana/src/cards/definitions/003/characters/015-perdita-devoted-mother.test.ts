/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { perditaDevotedMother } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import { flynnRiderFrenemy } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Perdita - Devoted Mother", () => {
  it("**COME ALONG, CHILDREN** When you play this character and whenever she quests, you may play a character with cost 2 or less from your discard for free.", async () => {
    const testEngine = new TestEngine({
      inkwell: perditaDevotedMother.cost,
      hand: [perditaDevotedMother],
      discard: [flynnRiderFrenemy],
    });

    await testEngine.playCard(perditaDevotedMother);

    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({
      targets: [flynnRiderFrenemy],
    });

    expect(testEngine.getCardModel(flynnRiderFrenemy).zone).toBe("play");
  });
});
