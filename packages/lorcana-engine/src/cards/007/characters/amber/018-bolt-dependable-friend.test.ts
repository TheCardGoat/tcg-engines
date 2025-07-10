/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { boltDependableFriend } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Bolt - Dependable Friend", () => {
  it("Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [boltDependableFriend, arielSpectacularSinger],
    });

    const cardUnderTest = testEngine.getCardModel(boltDependableFriend);
    const target = testEngine.getCardModel(arielSpectacularSinger);
    expect(target.strength).toBe(2);
    cardUnderTest.quest();
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [target] });
    expect(target.strength).toBe(4);
  });
});
