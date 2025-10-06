/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { johnSilverGreedyTreasureSeeker } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("John Silver - Greedy Treasure Seeker", () => {
  it.skip("**CHART YOUR OWN COURSE** For each location you have in play, this character gains **Resist** +1 and gets +1 {L}. _(Damage dealt to them is reduced by 1.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: johnSilverGreedyTreasureSeeker.cost,
      play: [johnSilverGreedyTreasureSeeker],
      hand: [johnSilverGreedyTreasureSeeker],
    });

    await testEngine.playCard(johnSilverGreedyTreasureSeeker);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
