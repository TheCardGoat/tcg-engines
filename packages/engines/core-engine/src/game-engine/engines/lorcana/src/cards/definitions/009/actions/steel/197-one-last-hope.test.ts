/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { oneLastHope } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("One Last Hope", () => {
  it.skip("_(A character with cost 3 or more can {E} to sing this song for free.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: oneLastHope.cost,
      play: [oneLastHope],
      hand: [oneLastHope],
    });

    await testEngine.playCard(oneLastHope);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Chosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn. _(Damage dealt to them is reduced by 2.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: oneLastHope.cost,
      play: [oneLastHope],
      hand: [oneLastHope],
    });

    await testEngine.playCard(oneLastHope);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
