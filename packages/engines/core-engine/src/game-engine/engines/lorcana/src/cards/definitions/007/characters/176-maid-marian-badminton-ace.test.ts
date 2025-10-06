/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goonsMaleficent } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { goofyFlyingFool } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import {
  ladyKluckProtectiveConfidant,
  maidMarianBadmintonAce,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Maid Marian - Badminton Ace", () => {
  it("During an opponent’s turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.", async () => {
    const testStore = new TestStore(
      {
        inkwell: goofyFlyingFool.cost,
        play: [goofyFlyingFool],
      },
      {
        inkwell: maidMarianBadmintonAce.cost,
        play: [maidMarianBadmintonAce, goonsMaleficent],
        hand: [],
      },
    );
    const allyToDamage = testStore.getCard(goonsMaleficent);
    const goodShotTarget = testStore.getCard(goofyFlyingFool);

    allyToDamage.updateCardMeta({ exerted: true });

    goodShotTarget.challenge(allyToDamage);

    testStore.changePlayer("player_two");
    testStore.resolveTopOfStack({ targets: [goodShotTarget] });
    expect(goodShotTarget.damage).toBe(goonsMaleficent.strength + 1);
  });

  it("Your characters named Lady Kluck gain Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: goonsMaleficent.cost,
        play: [goonsMaleficent],
      },
      {
        inkwell: maidMarianBadmintonAce.cost,
        play: [maidMarianBadmintonAce, ladyKluckProtectiveConfidant],
      },
    );

    const kluck = testEngine.getCardModel(ladyKluckProtectiveConfidant);
    kluck.updateCardMeta({ exerted: true });

    const attacker = testEngine.getCardModel(goonsMaleficent);
    attacker.challenge(kluck);
    expect(kluck.damage).toBe(goonsMaleficent.strength - 1);
  });
});
