import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { roxannePowerlineFan } from "./113-roxanne-powerline-fan";

describe("Roxanne - Powerline Fan", () => {
  it("CONCERT LOVER While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.", async () => {
    const testEngine = new TestEngine({
      inkwell: powerlineWorldsGreatestRockStar.cost,
      play: [roxannePowerlineFan],
      hand: [powerlineWorldsGreatestRockStar],
    });

    const cardUnderTest = testEngine.getCardModel(roxannePowerlineFan);
    expect(cardUnderTest.strength).toBe(roxannePowerlineFan.strength);
    expect(cardUnderTest.lore).toBe(roxannePowerlineFan.lore);

    await testEngine.playCard(powerlineWorldsGreatestRockStar);

    expect(cardUnderTest.strength).toBe(roxannePowerlineFan.strength + 1);
    expect(cardUnderTest.lore).toBe(roxannePowerlineFan.lore + 1);
  });
});
