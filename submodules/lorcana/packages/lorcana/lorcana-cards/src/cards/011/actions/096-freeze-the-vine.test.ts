import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { healingGlow, heiheiBoatSnack, mickeyMouseTrueFriend, moanaOfMotunui } from "../../001";
import {
  beastsCastleWinterGardens,
  graveyardOfChristmasFutureLonelyRestingPlace,
} from "../locations";
import { freezeTheVine } from "./096-freeze-the-vine";

describe("Freeze the Vine", () => {
  it("banishes all locations, draws 2 cards, then discards the chosen card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [freezeTheVine, healingGlow],
        inkwell: freezeTheVine.cost,
        play: [beastsCastleWinterGardens],
        deck: [heiheiBoatSnack, mickeyMouseTrueFriend],
      },
      {
        play: [graveyardOfChristmasFutureLonelyRestingPlace],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(freezeTheVine, {
        targets: [healingGlow],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(beastsCastleWinterGardens)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(graveyardOfChristmasFutureLonelyRestingPlace)).toBe(
      "discard",
    );
    expect(testEngine.asPlayerOne().getCardZone(healingGlow)).toBe("discard");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });

  it("clears atLocationId on characters when their location is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [freezeTheVine, healingGlow],
        inkwell: freezeTheVine.cost,
        play: [
          { card: moanaOfMotunui, atLocation: beastsCastleWinterGardens },
          beastsCastleWinterGardens,
        ],
        deck: [heiheiBoatSnack, mickeyMouseTrueFriend],
      },
      {
        play: [graveyardOfChristmasFutureLonelyRestingPlace],
      },
    );

    // Verify character is at the location before banish
    const charBefore = testEngine.asPlayerOne().getCard(moanaOfMotunui);
    expect(charBefore.atLocationId).toBeDefined();

    expect(
      testEngine.asPlayerOne().playCard(freezeTheVine, {
        targets: [healingGlow],
      }).success,
    ).toBe(true);

    // Both locations should be banished
    expect(testEngine.asPlayerOne().getCardZone(beastsCastleWinterGardens)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(graveyardOfChristmasFutureLonelyRestingPlace)).toBe(
      "discard",
    );

    // Character should remain in play but no longer at a location
    expect(testEngine.asPlayerOne().getCardZone(moanaOfMotunui)).toBe("play");
    const charAfter = testEngine.asPlayerOne().getCard(moanaOfMotunui);
    expect(charAfter.atLocationId).toBeUndefined();
  });
});
