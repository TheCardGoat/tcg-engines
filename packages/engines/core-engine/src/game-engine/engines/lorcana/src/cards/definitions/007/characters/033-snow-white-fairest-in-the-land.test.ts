/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { snowWhiteFairestInTheLand } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
