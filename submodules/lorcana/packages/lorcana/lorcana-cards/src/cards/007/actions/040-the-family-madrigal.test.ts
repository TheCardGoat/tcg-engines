import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { isabelaMadrigalInTheMoment } from "../../007";
import { restoringTheHeart } from "./039-restoring-the-heart";
import { theFamilyMadrigal } from "./040-the-family-madrigal";
import { thisIsMyFamily } from "./081-this-is-my-family";

describe("The Family Madrigal", () => {
  it("rejects selecting a non-Madrigal character for the Madrigal destination via pending resolution", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theFamilyMadrigal],
      inkwell: theFamilyMadrigal.cost,
      deck: [
        arielOnHumanLegs,
        thisIsMyFamily,
        isabelaMadrigalInTheMoment,
        simbaProtectiveCub,
        restoringTheHeart,
      ],
    });

    expect(testEngine.asPlayerOne().playCard(theFamilyMadrigal).success).toBe(true);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    // Ariel is a character but NOT a Madrigal — selecting her for the Madrigal destination must fail
    expect(
      testEngine.asPlayerOne().resolvePendingEffect(theFamilyMadrigal, {
        destinations: [
          {
            zone: "hand",
            cards: [arielOnHumanLegs],
          },
          {
            zone: "hand",
            cards: [thisIsMyFamily],
          },
          {
            zone: "deck-top",
            cards: [isabelaMadrigalInTheMoment, simbaProtectiveCub, restoringTheHeart],
          },
        ],
      }).success,
    ).toBe(false);

    // The pending effect should still be unresolved
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
  });

  it("allows selecting only a song without a Madrigal character via pending resolution", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theFamilyMadrigal],
      inkwell: theFamilyMadrigal.cost,
      deck: [
        arielOnHumanLegs,
        thisIsMyFamily,
        isabelaMadrigalInTheMoment,
        simbaProtectiveCub,
        restoringTheHeart,
      ],
    });

    expect(testEngine.asPlayerOne().playCard(theFamilyMadrigal).success).toBe(true);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    // Provide an explicit empty selection for the Madrigal slot, then the song slot
    expect(
      testEngine.asPlayerOne().resolvePendingEffect(theFamilyMadrigal, {
        destinations: [
          {
            zone: "hand",
            cards: [],
          },
          {
            zone: "hand",
            cards: [thisIsMyFamily],
          },
          {
            zone: "deck-top",
            cards: [
              isabelaMadrigalInTheMoment,
              arielOnHumanLegs,
              simbaProtectiveCub,
              restoringTheHeart,
            ],
          },
        ],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getCardZone(thisIsMyFamily)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(isabelaMadrigalInTheMoment)).toBe("deck");
  });

  it("puts up to 1 Madrigal character and up to 1 song into your hand and keeps the rest on top in order", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theFamilyMadrigal],
      inkwell: theFamilyMadrigal.cost,
      deck: [
        arielOnHumanLegs,
        thisIsMyFamily,
        isabelaMadrigalInTheMoment,
        simbaProtectiveCub,
        restoringTheHeart,
      ],
    });

    expect(
      testEngine.asPlayerOne().playCard(theFamilyMadrigal, {
        destinations: [
          {
            zone: "hand",
            cards: [isabelaMadrigalInTheMoment],
          },
          {
            zone: "hand",
            cards: [thisIsMyFamily],
          },
          {
            zone: "deck-top",
            cards: [simbaProtectiveCub, restoringTheHeart, arielOnHumanLegs],
          },
        ],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(isabelaMadrigalInTheMoment)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(thisIsMyFamily)).toBe("hand");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE).slice(0, 3)).toEqual([
      simbaProtectiveCub.id,
      restoringTheHeart.id,
      arielOnHumanLegs.id,
    ]);
  });

  it("creates a pending scry selection when destinations are not provided up front", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theFamilyMadrigal],
      inkwell: theFamilyMadrigal.cost,
      deck: [
        arielOnHumanLegs,
        thisIsMyFamily,
        isabelaMadrigalInTheMoment,
        simbaProtectiveCub,
        restoringTheHeart,
      ],
    });

    expect(testEngine.asPlayerOne().playCard(theFamilyMadrigal).success).toBe(true);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(testEngine.asPlayerOne().getPendingEffects()[0]).toEqual(
      expect.objectContaining({
        type: "scry-selection",
      }),
    );
    expect(
      testEngine.asPlayerOne().resolvePendingEffect(theFamilyMadrigal, {
        destinations: [
          {
            zone: "hand",
            cards: [isabelaMadrigalInTheMoment],
          },
          {
            zone: "hand",
            cards: [thisIsMyFamily],
          },
          {
            zone: "deck-top",
            cards: [simbaProtectiveCub, restoringTheHeart, arielOnHumanLegs],
          },
        ],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getCardZone(isabelaMadrigalInTheMoment)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(thisIsMyFamily)).toBe("hand");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE).slice(0, 3)).toEqual([
      simbaProtectiveCub.id,
      restoringTheHeart.id,
      arielOnHumanLegs.id,
    ]);
  });

  it("includes filter metadata for the Family Madrigal scry destinations", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theFamilyMadrigal],
      inkwell: theFamilyMadrigal.cost,
      deck: [
        arielOnHumanLegs,
        thisIsMyFamily,
        isabelaMadrigalInTheMoment,
        simbaProtectiveCub,
        restoringTheHeart,
      ],
    });

    expect(testEngine.asPlayerOne().playCard(theFamilyMadrigal).success).toBe(true);

    const pendingEffect = testEngine.asServer().getState().G.pendingEffects[0];
    expect(pendingEffect?.selectionContext).toMatchObject({
      kind: "scry-selection",
      destinationRules: [
        {
          zone: "hand",
          max: 1,
          reveal: true,
          filters: [{ type: "and" }],
        },
        {
          zone: "hand",
          max: 1,
          reveal: true,
          filters: [{ type: "song" }],
        },
        {
          zone: "deck-top",
          remainder: true,
          ordering: "player-choice",
        },
      ],
    });
  });
});
