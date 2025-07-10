/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import {
  mauricesMachine,
  unconventionalTool,
} from "@lorcanito/lorcana-engine/cards/007";
import { geppettoSkilledCraftsman } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
