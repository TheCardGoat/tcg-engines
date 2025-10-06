/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { davidImpressiveSurfer } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("David - Impressive Surfer", () => {
  it.skip("SHOWING OFF While you have a character named Nani in play, this character gets +2 {L}.", async () => {
    const testEngine = new TestEngine({
      inkwell: davidImpressiveSurfer.cost,
      play: [davidImpressiveSurfer],
      hand: [davidImpressiveSurfer],
    });

    await testEngine.playCard(davidImpressiveSurfer);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
