/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { beastFrustratedDesigner } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Beast - Frustrated Designer", () => {
  it.skip("I'VE HAD IT! {E}, 2 {I}, Banish 2 of your items – Deal 5 damage to chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: beastFrustratedDesigner.cost,
      play: [beastFrustratedDesigner],
      hand: [beastFrustratedDesigner],
    });

    await testEngine.playCard(beastFrustratedDesigner);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
