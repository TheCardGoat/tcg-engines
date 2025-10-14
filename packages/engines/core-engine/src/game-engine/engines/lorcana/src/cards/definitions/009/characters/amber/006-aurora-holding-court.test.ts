import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { theQueenWickedAndVain } from "../amethyst/035-the-queen-wicked-and-vain";
import { mulanConsiderateDiplomat } from "../sapphire/142-mulan-considerate-diplomat";

describe("Aurora - Holding Court", () => {
  it("[QUEEN] ROYAL WELCOME Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: theQueenWickedAndVain.cost - 1,
      play: [auroraHoldingCourt],
      hand: [theQueenWickedAndVain],
    });

    await testEngine.questCard(auroraHoldingCourt);
    await testEngine.playCard(theQueenWickedAndVain);

    expect(testEngine.getCardModel(theQueenWickedAndVain).zone).toEqual("play");
  });

  it("[PRINCESS] ROYAL WELCOME Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: mulanConsiderateDiplomat.cost - 1,
      play: [auroraHoldingCourt],
      hand: [mulanConsiderateDiplomat],
    });

    await testEngine.questCard(auroraHoldingCourt);
    await testEngine.playCard(mulanConsiderateDiplomat);

    expect(testEngine.getCardModel(mulanConsiderateDiplomat).zone).toEqual(
      "play",
    );
  });

  describe("Regression Tests", () => {
    it("Double Aurora Playing Double Princess", async () => {
      const initialInkwell = tianaRestaurantOwner.cost * 2;
      const testEngine = new TestEngine({
        inkwell: initialInkwell, // -1 less for each Aurora
        play: [auroraHoldingCourt, auroraHoldingCourt],
        hand: [tianaRestaurantOwner, tianaRestaurantOwner],
      });

      await testEngine.questCard(
        testEngine.getCardModel(auroraHoldingCourt, 0),
      );
      await testEngine.questCard(
        testEngine.getCardModel(auroraHoldingCourt, 1),
      );

      expect(testEngine.getAvailableInkwellCardCount()).toEqual(initialInkwell);

      await testEngine.playCard(
        testEngine.getCardModel(tianaRestaurantOwner, 0),
      );

      expect(testEngine.getAvailableInkwellCardCount()).toEqual(
        initialInkwell - (tianaRestaurantOwner.cost - 2), // 2 Auroras, so 2 less inkwell
      );

      await testEngine.playCard(
        testEngine.getCardModel(tianaRestaurantOwner, 1),
      );

      expect(testEngine.getAvailableInkwellCardCount()).toEqual(
        initialInkwell -
          (tianaRestaurantOwner.cost - 2) -
          tianaRestaurantOwner.cost, // second tiana should cost full cost
      );
    });
  });
});
