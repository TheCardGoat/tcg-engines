/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import {
  mauricesMachine,
  unconventionalTool,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import { geppettoSkilledCraftsman } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Geppetto - Skilled Craftsman", () => {
  it("SEEKING INSPIRATION Whenever this character quests, you may choose and discard any number of item cards to gain 1 lore for each item card discarded this way.", async () => {
    const testEngine = new TestEngine({
      inkwell: geppettoSkilledCraftsman.cost,
      play: [geppettoSkilledCraftsman],
      hand: [pawpsicle, mauricesMachine, unconventionalTool],
    });

    await testEngine.questCard(geppettoSkilledCraftsman);
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({
      targets: [mauricesMachine, unconventionalTool],
    });

    expect(testEngine.getLoreForPlayer("player_one")).toBe(4);

    expect(testEngine.getCardModel(pawpsicle).zone).toBe("hand");
  });
});
