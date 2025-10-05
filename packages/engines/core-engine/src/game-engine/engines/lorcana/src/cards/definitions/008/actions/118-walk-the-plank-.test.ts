import { describe, expect, it } from "bun:test";
import { genieCrampedInTheLamp } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { walkThePlank } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

// Test pirates with proper classifications
const billyBonesPirate: LorcanaCharacterCardDefinition = {
  id: "billyBonesPirateTest",
  type: "character",
  name: "Billy Bones",
  title: "Pirate Test",
  characteristics: ["storyborn", "pirate", "captain"],
  inkwell: false,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Test",
  number: 1,
  set: "TEST",
  rarity: "common",
};

const mrSmeePirate: LorcanaCharacterCardDefinition = {
  id: "mrSmeePirateTest",
  type: "character",
  name: "Mr. Smee",
  title: "Pirate Test",
  characteristics: ["storyborn", "pirate", "ally"],
  inkwell: false,
  colors: ["steel"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Test",
  number: 2,
  set: "TEST",
  rarity: "common",
};

describe("Walk The Plank!", () => {
  it("Your Pirate characters gain '{E} – Banish chosen damaged character' this turn.", async () => {
    const pirates = [billyBonesPirate, mrSmeePirate];
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

    // The effect auto-resolves and applies to all pirate characters
    expect(testEngine.stackLayers).toHaveLength(0);

    for (const pirate of pirates) {
      expect(testEngine.getCardModel(pirate).hasActivatedAbility).toEqual(true);
    }

    await testEngine.activateCard(mrSmeePirate, {
      targets: [genieCrampedInTheLamp],
    });
    expect(testEngine.getCardModel(genieCrampedInTheLamp).zone).toBe("discard");
  });
});
