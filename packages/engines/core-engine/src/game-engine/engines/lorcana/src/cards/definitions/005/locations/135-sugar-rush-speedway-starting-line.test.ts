import { describe, expect, it } from "bun:test";
import { stichtCarefreeSurfer } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { vanellopeVonSchweetzSugarRushChamp } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  rapunzelsTowerSecludedPrison,
  sugarRushSpeedwayStartingLine,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/index";
import { sugarRushSpeedwayFinishLine } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sugar Rush Speedway - Starting Line", () => {
  it("**ON YOUR MARKS!** Once per turn, you may {E} chosen character here and deal them 1 damage to move them to another location for free.", () => {
    const testStore = new TestStore({
      inkwell: sugarRushSpeedwayStartingLine.moveCost,
      play: [
        sugarRushSpeedwayStartingLine,
        stichtCarefreeSurfer,
        rapunzelsTowerSecludedPrison,
      ],
    });

    const cardUnderTest = testStore.getCard(sugarRushSpeedwayStartingLine);
    const characterUnderTest = testStore.getCard(stichtCarefreeSurfer);
    const anotherLocation = testStore.getCard(rapunzelsTowerSecludedPrison);

    characterUnderTest.updateCardMeta({ exerted: false, damage: 0 });

    characterUnderTest.enterLocation(cardUnderTest);

    expect(characterUnderTest.meta.exerted).toBe(false);

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targets: [characterUnderTest] }, true);
    testStore.resolveTopOfStack({ targets: [anotherLocation] });

    expect(characterUnderTest.meta.damage).toBe(1);
    expect(characterUnderTest.meta.exerted).toBe(true);
    expect(characterUnderTest.isAtLocation(anotherLocation)).toBe(true);
  });

  describe("Regression test", () => {
    it("Character dying while moving from starting line", async () => {
      const testEngine = new TestEngine({
        inkwell:
          sugarRushSpeedwayFinishLine.moveCost +
          sugarRushSpeedwayStartingLine.moveCost,
        play: [
          sugarRushSpeedwayFinishLine,
          sugarRushSpeedwayStartingLine,
          vanellopeVonSchweetzSugarRushChamp,
        ],
        deck: 5,
      });

      await testEngine.moveToLocation({
        location: sugarRushSpeedwayStartingLine as any,
        character: vanellopeVonSchweetzSugarRushChamp,
      });

      await testEngine.setCardDamage(
        vanellopeVonSchweetzSugarRushChamp,
        vanellopeVonSchweetzSugarRushChamp.willpower - 1,
      );

      await testEngine.activateCard(
        sugarRushSpeedwayStartingLine,
        {
          targets: [vanellopeVonSchweetzSugarRushChamp],
        },
        true,
      );

      await testEngine.resolveTopOfStack(
        {
          targets: [sugarRushSpeedwayFinishLine],
        },
        true,
      );

      // Resolve Finish Line ability
      await testEngine.resolveOptionalAbility();

      expect(testEngine.getPlayerLore()).toEqual(3);
      expect(testEngine.getZonesCardCount().hand).toEqual(3);
      expect(testEngine.getCardModel(sugarRushSpeedwayFinishLine).zone).toBe(
        "discard",
      );

      expect(
        testEngine.getCardModel(vanellopeVonSchweetzSugarRushChamp).zone,
      ).toBe("discard");
    });
  });
});
