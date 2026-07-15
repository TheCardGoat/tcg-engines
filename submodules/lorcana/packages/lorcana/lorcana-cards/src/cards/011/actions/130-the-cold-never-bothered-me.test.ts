import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack, mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { theFrozenVineMonstrousPlant } from "../locations";
import { theColdNeverBotheredMe } from "./130-the-cold-never-bothered-me";

describe("The Cold Never Bothered Me", () => {
  it("takes a looked-at location into hand and reduces the next location you play this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theColdNeverBotheredMe],
      inkwell: theColdNeverBotheredMe.cost,
      deck: [
        heiheiBoatSnack,
        mickeyMouseTrueFriend,
        simbaProtectiveCub,
        theFrozenVineMonstrousPlant,
      ],
    });

    expect(
      testEngine.asPlayerOne().playCardWithDestinations(
        theColdNeverBotheredMe,
        {
          zone: "hand",
          cards: theFrozenVineMonstrousPlant,
        },
        {
          zone: "discard",
          cards: [simbaProtectiveCub, mickeyMouseTrueFriend, heiheiBoatSnack],
        },
      ).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(theFrozenVineMonstrousPlant)).toBe("hand");
    expect(testEngine.asPlayerOne().playCard(theFrozenVineMonstrousPlant)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(theFrozenVineMonstrousPlant)).toBe("play");
  });
});
