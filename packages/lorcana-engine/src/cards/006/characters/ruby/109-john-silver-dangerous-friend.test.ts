/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { johnSilverDangerousFriend } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("John Silver - Dangerous Friend", () => {
  it.skip("YOU HAVE TO CHART YOUR OWN COURSE Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: johnSilverDangerousFriend.cost,
      play: [johnSilverDangerousFriend],
      hand: [johnSilverDangerousFriend],
    });

    await testEngine.playCard(johnSilverDangerousFriend);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
