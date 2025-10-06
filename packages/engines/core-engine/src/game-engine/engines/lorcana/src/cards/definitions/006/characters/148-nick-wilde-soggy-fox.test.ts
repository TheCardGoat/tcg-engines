/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { nickWildeSoggyFox } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Nick Wilde - Soggy Fox", () => {
  it.skip("NICE TO HAVE A PARTNER While you have another character with Support in play, this character gets +2 {S}.", async () => {
    const testEngine = new TestEngine({
      inkwell: nickWildeSoggyFox.cost,
      play: [nickWildeSoggyFox],
      hand: [nickWildeSoggyFox],
    });

    await testEngine.playCard(nickWildeSoggyFox);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
