/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { robinHoodBelovedOutlaw } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { sherwoodForestOutlawHideaway } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Sherwood Forest - Outlaw Hideaway", () => {
  it("**FOREST HOME** Your characters named Robin Hood may move here for free.", () => {
    const testStore = new TestStore({
      play: [sherwoodForestOutlawHideaway, robinHoodBelovedOutlaw],
    });

    const cardUnderTest = testStore.getCard(sherwoodForestOutlawHideaway);
    const target = testStore.getCard(robinHoodBelovedOutlaw);

    target.enterLocation(cardUnderTest);

    expect(cardUnderTest.containsCharacter(target)).toBe(true);
    expect(target.isAtLocation(cardUnderTest)).toBe(true);
  });

  describe("**FAMILIAR TERRAIN** Characters gain **Ward** and '{E} , 1 {I} − Deal 2 damage to chosen damaged character' while here. _(Opponents can't choose them except to challenge.)_", () => {
    it("{E} – Deal 2 damage to chosen damaged character.", () => {
      const testStore = new TestStore(
        {
          inkwell: sherwoodForestOutlawHideaway.moveCost + 1,
          play: [sherwoodForestOutlawHideaway, liloMakingAWish],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      const cardUnderTest = testStore.getCard(sherwoodForestOutlawHideaway);
      const target = testStore.getCard(liloMakingAWish);
      const opponent = testStore.getCard(goofyKnightForADay);
      opponent.updateCardMeta({ damage: 1 });

      expect(target.activatedAbilities).toHaveLength(0);
      target.enterLocation(cardUnderTest);
      expect(target.activatedAbilities).toHaveLength(1);

      target.activate();
      testStore.resolveTopOfStack({ targets: [opponent] });

      expect(opponent.damage).toBe(3);
    });

    it("Characters gain **Ward** _(Opponents can't choose them except to challenge.)_", () => {
      const testStore = new TestStore(
        {
          inkwell: sherwoodForestOutlawHideaway.moveCost,
          play: [sherwoodForestOutlawHideaway, liloMakingAWish],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      const cardUnderTest = testStore.getCard(sherwoodForestOutlawHideaway);
      const attacker = testStore.getCard(liloMakingAWish);

      expect(attacker.hasWard).toBeFalsy();
      attacker.enterLocation(cardUnderTest);
      expect(attacker.hasWard).toBeTruthy();
    });
  });
});
