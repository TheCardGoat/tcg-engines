/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { soMuchToGive } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("So Much To Give", () => {
  it("Draw a card. Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: soMuchToGive.cost,
        hand: [soMuchToGive],
        deck: [hiramFlavershamToymaker],
      },
      { play: [tipoGrowingSon] },
    );

    await testEngine.playCard(soMuchToGive);

    const target = testEngine.getCardModel(tipoGrowingSon);

    expect(testEngine.stackLayers).toHaveLength(1);
    await testEngine.resolveTopOfStack({ targets: [target] });
    expect(testEngine.stackLayers).toHaveLength(0);
    expect(testEngine.getZonesCardCount().hand).toEqual(1);
    expect(target.hasAbility("bodyguard")).toBe(true);
  });
});
