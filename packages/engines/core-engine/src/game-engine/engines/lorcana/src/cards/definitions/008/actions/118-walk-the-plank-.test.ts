import { describe, expect, it } from "bun:test";
import { mrSmee } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  billyBonesKeeperOfTheMap,
  genieCrampedInTheLamp,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { walkThePlank } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
