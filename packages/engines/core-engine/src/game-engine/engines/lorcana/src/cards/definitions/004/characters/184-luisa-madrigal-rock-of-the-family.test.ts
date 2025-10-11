import { describe, expect, it } from "bun:test";
import {
  diabloDevotedHerald,
  luisaMadrigalRockOfTheFamily,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("**I'M THE STRONG ONE** While you have another character in play, this character gets +2 {S}.", () => {
  it("Alone", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [luisaMadrigalRockOfTheFamily],
    });

    expect(testEngine.getCardModel(luisaMadrigalRockOfTheFamily).strength).toBe(
      2,
    );
  });
  it("Not alone", async () => {
    const testEngine = new TestEngine({
      inkwell: luisaMadrigalRockOfTheFamily.cost,
      play: [luisaMadrigalRockOfTheFamily, diabloDevotedHerald],
    });

    expect(testEngine.getCardModel(luisaMadrigalRockOfTheFamily).strength).toBe(
      4,
    );
  });
});
