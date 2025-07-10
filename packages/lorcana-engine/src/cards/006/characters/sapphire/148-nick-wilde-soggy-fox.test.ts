/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { nickWildeSoggyFox } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
