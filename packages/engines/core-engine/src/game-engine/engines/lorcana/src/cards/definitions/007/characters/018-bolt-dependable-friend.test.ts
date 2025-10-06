/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { arielSpectacularSinger } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { boltDependableFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

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
