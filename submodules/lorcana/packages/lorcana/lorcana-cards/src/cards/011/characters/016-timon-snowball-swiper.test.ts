import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { healingGlow, simbaProtectiveCub } from "../../001";
import { timonSnowballSwiper } from "./016-timon-snowball-swiper";

describe("Timon - Snowball Swiper", () => {
  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [timonSnowballSwiper],
      inkwell: timonSnowballSwiper.cost,
    });

    expect(testEngine.asPlayerOne().playCard(timonSnowballSwiper)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(timonSnowballSwiper)).toBe("play");
  });

  describe("GET RID OF THAT - When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.", () => {
    it("reveals the opponent's hand and discards a non-character card chosen by the controller", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [timonSnowballSwiper],
          inkwell: timonSnowballSwiper.cost,
        },
        {
          hand: [healingGlow, simbaProtectiveCub],
        },
      );

      const actionCardId = testEngine.findCardInstanceId(healingGlow, "hand", PLAYER_TWO);

      // Play Timon - triggered ability auto-resolves the bag, then suspends for discard choice
      expect(testEngine.asPlayerOne().playCard(timonSnowballSwiper)).toBeSuccessfulCommand();

      // Controller chooses the non-character card to discard
      expect(testEngine.asPlayerOne().respondWith(actionCardId)).toBeSuccessfulCommand();

      // Action card is discarded
      expect(testEngine.asPlayerTwo().getCardZone(healingGlow)).toBe("discard");

      // Character card remains in hand
      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
    });

    it("does not allow discarding character cards when no non-character cards exist", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [timonSnowballSwiper],
          inkwell: timonSnowballSwiper.cost,
        },
        {
          hand: [simbaProtectiveCub],
        },
      );

      // Play Timon - ability resolves fully since there are no valid discard targets
      expect(testEngine.asPlayerOne().playCard(timonSnowballSwiper)).toBeSuccessfulCommand();

      // Character card stays in hand (no valid targets for discard)
      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
    });
  });
});
