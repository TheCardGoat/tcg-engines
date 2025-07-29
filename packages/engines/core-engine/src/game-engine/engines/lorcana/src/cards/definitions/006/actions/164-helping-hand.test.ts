/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { helpingHand } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";

describe("Helping Hand", () => {
  it("Chosen character gains Support this turn. Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: helpingHand.cost,
      play: [mickeyBraveLittleTailor],
      hand: [helpingHand],
    });

    await testEngine.playCard(helpingHand);
    await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });

    expect(testEngine.getZonesCardCount().hand).toBe(1);
  });
});
