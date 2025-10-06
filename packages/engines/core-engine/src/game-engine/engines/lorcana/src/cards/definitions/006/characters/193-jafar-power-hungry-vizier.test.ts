/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { jafarPowerhungryVizier } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Jafar - Power‐Hungry Vizier", () => {
  it.skip("YOU WILL BE PAID WHEN THE TIME COMES During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: jafarPowerhungryVizier.cost,
      play: [jafarPowerhungryVizier],
      hand: [jafarPowerhungryVizier],
    });

    await testEngine.playCard(jafarPowerhungryVizier);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
