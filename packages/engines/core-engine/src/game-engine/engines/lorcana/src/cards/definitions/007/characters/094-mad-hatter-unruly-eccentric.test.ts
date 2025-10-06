/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { madHatterUnrulyEccentric } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Mad Hatter - Unruly Eccentric", () => {
  it.skip("UNBIRTHDAY PRESENT Whenever a damaged character challenges another character, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: madHatterUnrulyEccentric.cost,
      play: [madHatterUnrulyEccentric],
      hand: [madHatterUnrulyEccentric],
    });

    await testEngine.playCard(madHatterUnrulyEccentric);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
