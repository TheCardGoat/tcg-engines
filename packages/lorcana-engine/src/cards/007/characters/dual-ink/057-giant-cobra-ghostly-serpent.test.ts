/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  duchessElegantFeline,
  giantCobraGhostlySerpent,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Giant Cobra - Ghostly Serpent", () => {
  it.skip("Vanish (When an opponent chooses this character for an action, banish them.)", async () => {
    const testEngine = new TestEngine({
      inkwell: giantCobraGhostlySerpent.cost,
      play: [giantCobraGhostlySerpent],
      hand: [giantCobraGhostlySerpent],
    });

    await testEngine.playCard(giantCobraGhostlySerpent);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it("MYSTERIOUS ADVANTAGE When you play this character, you may choose and discard a card to gain 2 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: giantCobraGhostlySerpent.cost,
      hand: [giantCobraGhostlySerpent, duchessElegantFeline],
    });

    await testEngine.playCard(giantCobraGhostlySerpent);

    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [duchessElegantFeline] });

    expect(testEngine.getCardModel(duchessElegantFeline).zone).toEqual(
      "discard",
    );
    expect(testEngine.getLoreForPlayer()).toBe(2);
  });
});
