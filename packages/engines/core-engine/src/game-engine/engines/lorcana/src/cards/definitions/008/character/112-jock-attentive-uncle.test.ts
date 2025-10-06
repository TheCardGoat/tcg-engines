/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { louieChillNephew } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  deweyLovableShowoff,
  jockAttentiveUncle,
  trampDapperRascal,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Jock - Attentive Uncle", () => {
  it("VOICE OF EXPERIENCE When you play this character, if you have 3 or more other characters in play, gain 2 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: jockAttentiveUncle.cost,
      hand: [jockAttentiveUncle],
      play: [deweyLovableShowoff, louieChillNephew, trampDapperRascal],
    });

    const cardUnderTest = testEngine.getCardModel(jockAttentiveUncle);

    await testEngine.playCard(cardUnderTest);

    expect(testEngine.getLoreForPlayer()).toEqual(2);
  });

  it("VOICE OF EXPERIENCE When you play this character, if you have 3 total in play, do not gain 2 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: jockAttentiveUncle.cost,
      hand: [jockAttentiveUncle],
      play: [deweyLovableShowoff, louieChillNephew],
    });

    const cardUnderTest = testEngine.getCardModel(jockAttentiveUncle);

    await testEngine.playCard(cardUnderTest);

    expect(testEngine.getLoreForPlayer()).toEqual(0);
  });
});
