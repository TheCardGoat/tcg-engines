/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { snowWhiteFairestInTheLand } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

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
