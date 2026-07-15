import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack, mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { graveyardOfChristmasFutureLonelyRestingPlace } from "../locations/135-graveyard-of-christmas-future-lonely-resting-place";
import { visitingChristmasPast } from "./162-visiting-christmas-past";

describe("Visiting Christmas Past", () => {
  it("puts selected cards from under your characters and locations into your inkwell exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [visitingChristmasPast],
      inkwell: visitingChristmasPast.cost,
      play: [simbaProtectiveCub, graveyardOfChristmasFutureLonelyRestingPlace],
      deck: [heiheiBoatSnack, mickeyMouseTrueFriend],
    });

    testEngine.putCardUnder(simbaProtectiveCub, heiheiBoatSnack);
    testEngine.putCardUnder(graveyardOfChristmasFutureLonelyRestingPlace, mickeyMouseTrueFriend);
    const [heiheiId] = testEngine.getCardsUnder(simbaProtectiveCub);
    const [mickeyId] = testEngine.getCardsUnder(graveyardOfChristmasFutureLonelyRestingPlace);

    expect(
      testEngine.asPlayerOne().playCard(visitingChristmasPast, {
        targets: [heiheiId, mickeyId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(heiheiId)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(mickeyId)).toBe("inkwell");
    expect(testEngine.asServer().getCard(heiheiId)).toEqual(
      expect.objectContaining({ zone: "inkwell", exerted: true }),
    );
    expect(testEngine.asServer().getCard(mickeyId)).toEqual(
      expect.objectContaining({ zone: "inkwell", exerted: true }),
    );
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[heiheiId]?.publicFaceState,
    ).toBe("faceDown");
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[mickeyId]?.publicFaceState,
    ).toBe("faceDown");
  });

  it("allows selecting zero cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [visitingChristmasPast],
      inkwell: visitingChristmasPast.cost,
      play: [simbaProtectiveCub],
      deck: [heiheiBoatSnack],
    });

    testEngine.putCardUnder(simbaProtectiveCub, heiheiBoatSnack);

    expect(
      testEngine.asPlayerOne().playCard(visitingChristmasPast, {
        targets: [],
      }).success,
    ).toBe(true);

    expect(testEngine.getCardsUnder(simbaProtectiveCub)).toHaveLength(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(visitingChristmasPast.cost);
  });

  it("regression: ability triggers and moves cards from under characters into inkwell", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [visitingChristmasPast],
      inkwell: visitingChristmasPast.cost,
      play: [simbaProtectiveCub],
      deck: [heiheiBoatSnack],
    });

    testEngine.putCardUnder(simbaProtectiveCub, heiheiBoatSnack);
    const [heiheiId] = testEngine.getCardsUnder(simbaProtectiveCub);

    // Verify card is under the character before playing
    expect(testEngine.getCardsUnder(simbaProtectiveCub)).toHaveLength(1);

    expect(
      testEngine.asPlayerOne().playCard(visitingChristmasPast, {
        targets: [heiheiId],
      }).success,
    ).toBe(true);

    // Card should now be in inkwell
    expect(testEngine.asPlayerOne().getCardZone(heiheiId)).toBe("inkwell");
    // Character should no longer have cards underneath
    expect(testEngine.getCardsUnder(simbaProtectiveCub)).toHaveLength(0);
  });
});
