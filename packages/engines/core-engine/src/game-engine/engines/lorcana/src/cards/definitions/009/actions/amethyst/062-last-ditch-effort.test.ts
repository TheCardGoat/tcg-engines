/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { lastditchEffort } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Last-ditch Effort", () => {
  it.skip("Exert chosen opposing character. Then chosen character of yours gains Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
    const testEngine = new TestEngine({
      inkwell: lastditchEffort.cost,
      play: [lastditchEffort],
      hand: [lastditchEffort],
    });

    await testEngine.playCard(lastditchEffort);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
