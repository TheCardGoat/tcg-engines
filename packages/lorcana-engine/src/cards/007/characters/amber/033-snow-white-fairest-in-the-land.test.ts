/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { snowWhiteFairestInTheLand } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Snow White - Fairest in the Land", () => {
  it.skip("HIDDEN AWAY This character can't be challenged.", async () => {
    const testEngine = new TestEngine({
      inkwell: snowWhiteFairestInTheLand.cost,
      play: [snowWhiteFairestInTheLand],
      hand: [snowWhiteFairestInTheLand],
    });

    await testEngine.playCard(snowWhiteFairestInTheLand);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
