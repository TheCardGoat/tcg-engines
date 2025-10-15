import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { stitchRockStar } from "../../characters/amber/003-stitch-rock-star";
import { theQueenRegalMonarch } from "../../characters/amber/007-the-queen-regal-monarch";
import { rapunzelSunshine } from "../../characters/amber/008-rapunzel-sunshine";
import { powerlineWorldsGreatestRockStar } from "../../characters/ruby/110-powerline-world-s-greatest-rock-star";
import { maxGoofRockinTeen } from "../../characters/ruby/112-max-goof-rockin-teen";
import { roxannePowerlineFan } from "../../characters/ruby/113-roxanne-powerline-fan";

describe("I2I", () => {
  it("Sing Together 9 (Any number of your or your teammates’ characters with total cost 9 or more may {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      hand: [i2i],
    });

    expect(testEngine.getCardModel(i2i).hasSingTogether).toBe(true);
  });

  it("Each player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can’t quest for the rest of this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: i2i.cost,
      hand: [i2i],
    });

    await testEngine.playCard(i2i);

    expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
    expect(testEngine.getLoreForPlayer("player_two")).toBe(2);

    expect(testEngine.getCardsByZone("hand", "player_one")).toHaveLength(2);
    expect(testEngine.getCardsByZone("hand", "player_two")).toHaveLength(2);
  });

  it("If 2 or more characters sang this song, ready them. They can’t quest for the rest of this turn.", async () => {
    const singers = [roxannePowerlineFan, maxGoofRockinTeen, goofyDaredevil];
    const testEngine = new TestEngine({
      hand: [i2i],
      play: singers,
    });

    await testEngine.singSongTogether({
      song: i2i,
      singers: singers,
    });

    expect(testEngine.getCardModel(i2i).zone).toBe("discard");

    for (const singer of singers) {
      const cardModel = testEngine.getCardModel(singer);
      expect(cardModel.zone).toBe("play");
      expect(cardModel.ready).toBe(true);
      expect(cardModel.canQuest).toBe(false);
    }
  });

  describe("Regression tests", () => {
    it("Doesn't trigger if only one character sings.", async () => {
      const singers = [powerlineWorldsGreatestRockStar];
      const testEngine = new TestEngine({
        deck: [
          stitchRockStar,
          hakunaMatata,
          theQueenRegalMonarch,
          rapunzelSunshine,
        ],
        hand: [i2i],
        play: singers,
      });

      await testEngine.singSong({
        singer: powerlineWorldsGreatestRockStar,
        song: i2i,
      });

      expect(testEngine.getCardModel(i2i).zone).toBe("discard");

      for (const singer of singers) {
        const cardModel = testEngine.getCardModel(singer);
        expect(cardModel.zone).toBe("play");
        expect(cardModel.hasQuestRestriction).toBe(false);
        expect(cardModel.ready).toBe(false);
      }
    });

    it.skip("Doesn't trigger if sang by only one character. Powerline - World's Greatest Rock Star interaction", async () => {
      const singers = [powerlineWorldsGreatestRockStar];
      const testEngine = new TestEngine({
        deck: [stitchRockStar, i2i, theQueenRegalMonarch, rapunzelSunshine],
        hand: [hakunaMatata],
        play: singers,
      });

      await testEngine.singSong({
        singer: powerlineWorldsGreatestRockStar,
        song: hakunaMatata,
      });

      await testEngine.resolveTopOfStack({
        scry: {
          play: [i2i],
          bottom: [stitchRockStar, theQueenRegalMonarch, rapunzelSunshine],
        },
      });

      expect(testEngine.getCardModel(hakunaMatata).zone).toEqual("discard");
      expect(testEngine.getCardModel(i2i).zone).toBe("discard");

      for (const singer of singers) {
        const cardModel = testEngine.getCardModel(singer);
        expect(cardModel.zone).toBe("play");
        expect(cardModel.ready).toBe(false);
      }
    });
  });
});
