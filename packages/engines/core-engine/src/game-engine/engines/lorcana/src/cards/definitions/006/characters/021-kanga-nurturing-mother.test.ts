/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { kangaNurturingMother } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Kanga - Nurturing Mother", () => {
  it.skip("SAFE AND SOUND Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: kangaNurturingMother.cost,
      play: [kangaNurturingMother],
      hand: [kangaNurturingMother],
    });

    await testEngine.playCard(kangaNurturingMother);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
