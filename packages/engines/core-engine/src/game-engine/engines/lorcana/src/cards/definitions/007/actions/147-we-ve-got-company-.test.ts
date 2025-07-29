/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { weveGotCompany } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("We've Got Company!", () => {
  it.skip("Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)", async () => {
    const testEngine = new TestEngine({
      inkwell: weveGotCompany.cost,
      play: [weveGotCompany],
      hand: [weveGotCompany],
    });

    await testEngine.playCard(weveGotCompany);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
