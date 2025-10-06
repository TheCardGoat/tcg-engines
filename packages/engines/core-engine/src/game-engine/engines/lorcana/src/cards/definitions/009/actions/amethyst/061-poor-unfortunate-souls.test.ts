/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { poorUnfortunateSouls } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Poor Unfortunate Souls", () => {
  it.skip("(A character with cost 2 or more can {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      inkwell: poorUnfortunateSouls.cost,
      play: [poorUnfortunateSouls],
      hand: [poorUnfortunateSouls],
    });

    await testEngine.playCard(poorUnfortunateSouls);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Return chosen character, item, or location with cost 2 or less to their player's hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: poorUnfortunateSouls.cost,
      play: [poorUnfortunateSouls],
      hand: [poorUnfortunateSouls],
    });

    await testEngine.playCard(poorUnfortunateSouls);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
