import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { powerlineWorldsGreatestRockStar } from "../ruby/110-powerline-world-s-greatest-rock-star";

describe("Minnie Mouse - Sweetheart Princess", () => {
  it("ROYAL FAVOR Your characters named Mickey Mouse gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [minnieMouseSweetheartPrincess, mickeyMouseArtfulRogue],
    });

    const mickeyMouse = testEngine.getCardModel(mickeyMouseArtfulRogue);

    expect(mickeyMouse.hasSupport()).toBe(true);
  });

  it("BYE BYE, NOW Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.", async () => {
    const testEngine = new TestEngine(
      {
        play: [minnieMouseSweetheartPrincess],
      },
      {
        play: [cobraBubblesSimpleEducator],
      },
    );

    const cardUnderTest = testEngine.getCardModel(
      minnieMouseSweetheartPrincess,
    );
    const oppo = testEngine.getCardModel(cobraBubblesSimpleEducator);

    oppo.exert();
    cardUnderTest.quest();

    //await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [oppo] });

    expect(oppo.zone).toBe("discard");
  });

  describe("Regression Tests", () => {
    it.only("Should banish only one character", async () => {
      const testEngine = new TestEngine(
        {
          play: [minnieMouseSweetheartPrincess],
        },
        {
          play: [
            powerlineWorldsGreatestRockStar,
            powerlineWorldsGreatestRockStar,
          ],
        },
      );

      const powerOne = testEngine.getCardModel(
        powerlineWorldsGreatestRockStar,
        0,
      );
      const powerTwo = testEngine.getCardModel(
        powerlineWorldsGreatestRockStar,
        1,
      );

      await testEngine.tapCard(powerOne);
      await testEngine.tapCard(powerTwo);

      await testEngine.questCard(minnieMouseSweetheartPrincess);

      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({
        targets: [powerOne],
      });

      expect(powerOne.zone).toBe("discard");
      expect(powerTwo.zone).toBe("play");
    });
  });
});
