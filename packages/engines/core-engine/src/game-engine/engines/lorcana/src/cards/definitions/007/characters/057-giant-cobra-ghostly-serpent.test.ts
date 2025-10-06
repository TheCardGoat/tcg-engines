/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { magicBroomIlluminaryKeeper } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  duchessElegantFeline,
  giantCobraGhostlySerpent,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Giant Cobra - Ghostly Serpent", () => {
  it("Vanish (When an opponent chooses this character for an action, banish them.)", async () => {
    const testEngine = new TestEngine({
      play: [giantCobraGhostlySerpent],
    });

    expect(testEngine.getCardModel(giantCobraGhostlySerpent).hasVanish).toBe(
      true,
    );
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

describe("Regression", () => {
  test("Giant Cobra + Broom Interaction", async () => {
    const testEngine = new TestEngine({
      inkwell: giantCobraGhostlySerpent.cost,
      hand: [giantCobraGhostlySerpent],
      play: [magicBroomIlluminaryKeeper],
      deck: [duchessElegantFeline],
    });

    await testEngine.playCard(giantCobraGhostlySerpent);

    await testEngine.acceptOptionalLayerBySource({
      source: magicBroomIlluminaryKeeper,
    });
    expect(testEngine.getCardModel(magicBroomIlluminaryKeeper).zone).toEqual(
      "discard",
    );

    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [duchessElegantFeline] });

    expect(testEngine.getLoreForPlayer()).toBe(2);
    expect(testEngine.getCardModel(duchessElegantFeline).zone).toEqual(
      "discard",
    );
  });
});
