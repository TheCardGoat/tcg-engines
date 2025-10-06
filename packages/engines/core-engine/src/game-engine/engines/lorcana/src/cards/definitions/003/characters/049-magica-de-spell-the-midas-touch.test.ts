/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import { magicaDeSpellTheMidasTouch } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import { luckyDime } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Magica De Spell - The Midas Touch", () => {
  it("All Mine Whenever this character quests, gain lore equal to the cost of one of your items in play.", async () => {
    const testEngine = new TestEngine({
      play: [magicaDeSpellTheMidasTouch, luckyDime, dingleHopper],
    });

    await testEngine.questCard(magicaDeSpellTheMidasTouch);
    expect(testEngine.getPlayerLore()).toEqual(magicaDeSpellTheMidasTouch.lore);
    expect(testEngine.stackLayers).toHaveLength(1);

    await testEngine.resolveTopOfStack({ targets: [luckyDime] });
    expect(testEngine.getPlayerLore()).toEqual(
      magicaDeSpellTheMidasTouch.lore + luckyDime.cost,
    );
  });
});
