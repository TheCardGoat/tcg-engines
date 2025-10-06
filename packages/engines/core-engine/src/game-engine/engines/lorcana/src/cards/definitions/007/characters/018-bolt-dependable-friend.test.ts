/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { arielSpectacularSinger } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { boltDependableFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
