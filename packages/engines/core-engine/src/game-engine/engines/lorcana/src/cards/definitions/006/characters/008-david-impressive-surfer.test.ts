/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { davidImpressiveSurfer } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
