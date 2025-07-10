/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mrSmee } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  billyBonesKeeperOfTheMap,
  genieCrampedInTheLamp,
} from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { walkThePlank } from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Walk The Plank!", () => {
  it("Your Pirate characters gain '{E} – Banish chosen damaged character' this turn.", async () => {
    const pirates = [billyBonesKeeperOfTheMap, mrSmee];
    const testEngine = new TestEngine(
      {
        inkwell: walkThePlank.cost,
        play: pirates,
        hand: [walkThePlank],
      },
      {
        play: [genieCrampedInTheLamp],
      },
    );

    await testEngine.setCardDamage(genieCrampedInTheLamp, 1);

    for (const pirate of pirates) {
      expect(testEngine.getCardModel(pirate).hasActivatedAbility).toEqual(
        false,
      );
    }

    await testEngine.playCard(walkThePlank);

    for (const pirate of pirates) {
      expect(testEngine.getCardModel(pirate).hasActivatedAbility).toEqual(true);
    }

    await testEngine.activateCard(mrSmee, { targets: [genieCrampedInTheLamp] });
    expect(testEngine.getCardModel(genieCrampedInTheLamp).zone).toBe("discard");
  });
});
