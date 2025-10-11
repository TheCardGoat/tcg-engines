import { describe, it } from "bun:test";
import { jafarPowerhungryVizier } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
