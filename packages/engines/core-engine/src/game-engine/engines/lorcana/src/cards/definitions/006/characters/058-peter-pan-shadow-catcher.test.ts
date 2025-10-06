/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { peterPanShadowCatcher } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Peter Pan - Shadow Catcher", () => {
  it.skip("GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.", async () => {
    const testEngine = new TestEngine({
      inkwell: peterPanShadowCatcher.cost,
      play: [peterPanShadowCatcher],
      hand: [peterPanShadowCatcher],
    });

    await testEngine.playCard(peterPanShadowCatcher);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
