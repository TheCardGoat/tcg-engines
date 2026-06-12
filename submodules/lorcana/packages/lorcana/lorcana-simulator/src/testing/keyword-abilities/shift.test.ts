import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  fireTheCannons,
  liloMakingAWish,
  mickeyMouseTrueFriend,
  stitchRockStar,
  workTogether,
} from "@tcg/lorcana-cards/cards/001";
import { beastForbiddingRecluse, beastTragicHero } from "@tcg/lorcana-cards/cards/002";
import { hiddenCoveTranquilHaven } from "@tcg/lorcana-cards/cards/004";
import { baymaxGiantRobot, thunderboltWonderDog } from "@tcg/lorcana-cards/cards/007";
import { dalmatianPuppyTailWagger } from "@tcg/lorcana-cards/cards/008";
import { mickeyMouseBraveLittlePrince } from "@tcg/lorcana-cards/cards/009";
import { stitchNaughtyExperiment } from "@tcg/lorcana-cards/cards/011";
import { plutoFriendlyPooch } from "@tcg/lorcana-cards/cards/003";
import { naniCaringSister } from "@tcg/lorcana-cards/cards/006";

describe("Shift - Shift N (You may pay N {I} to play this on top of one of your characters named [Name].)", () => {
  it("Shift inherits exerted state, dry state, and damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseBraveLittlePrince, fireTheCannons],
      inkwell: 6,
      play: [{ card: mickeyMouseTrueFriend, exerted: true, damage: 1 }],
    });

    const shiftTarget = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(mickeyMouseBraveLittlePrince, {
        cost: { cost: "shift", shiftTarget },
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().isExerted(mickeyMouseBraveLittlePrince)).toBe(true);
    expect(testEngine.asPlayerOne().getCard(mickeyMouseBraveLittlePrince).drying).toBe(false);
    expect(testEngine.asPlayerOne().getDamage(mickeyMouseBraveLittlePrince)).toBe(1);
    expect(testEngine.getCardsUnder(mickeyMouseBraveLittlePrince)).toEqual([shiftTarget]);
  });

  it("Shifted character enters dry on a dry target and drying on a drying target", () => {
    const dryEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseBraveLittlePrince],
      inkwell: 5,
      play: [mickeyMouseTrueFriend],
    });
    const dryShiftTarget = dryEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_ONE);

    expect(
      dryEngine.asPlayerOne().playCard(mickeyMouseBraveLittlePrince, {
        cost: { cost: "shift", shiftTarget: dryShiftTarget },
      }).success,
    ).toBe(true);
    expect(dryEngine.asPlayerOne().getCard(mickeyMouseBraveLittlePrince).drying).toBe(false);
    expect(dryEngine.asPlayerOne().quest(mickeyMouseBraveLittlePrince).success).toBe(true);

    const dryingEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseBraveLittlePrince],
      inkwell: 5,
      play: [{ card: mickeyMouseTrueFriend, isDrying: true }],
    });
    const dryingShiftTarget = dryingEngine.findCardInstanceId(
      mickeyMouseTrueFriend,
      "play",
      PLAYER_ONE,
    );

    expect(
      dryingEngine.asPlayerOne().playCard(mickeyMouseBraveLittlePrince, {
        cost: { cost: "shift", shiftTarget: dryingShiftTarget },
      }).success,
    ).toBe(true);
    expect(dryingEngine.asPlayerOne().getCard(mickeyMouseBraveLittlePrince).drying).toBe(true);
    expect(dryingEngine.asPlayerOne().quest(mickeyMouseBraveLittlePrince).success).toBe(false);
  });

  it("Shifted character keeps effects that applied to the base character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [beastTragicHero, workTogether],
      inkwell: 4,
      play: [beastForbiddingRecluse],
    });

    expect(
      testEngine.asPlayerOne().playCard(workTogether, { targets: [beastForbiddingRecluse] })
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(beastForbiddingRecluse, "Support")).toBe(true);

    const shiftTarget = testEngine.findCardInstanceId(beastForbiddingRecluse, "play", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().playCard(beastTragicHero, {
        cost: { cost: "shift", shiftTarget },
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().hasKeyword(beastTragicHero, "Support")).toBe(true);
  });

  it("When a shifted stack leaves play, all cards go to the same zone", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mickeyMouseBraveLittlePrince, fireTheCannons],
      inkwell: 6,
      play: [mickeyMouseTrueFriend],
    });

    const shiftTarget = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().playCard(mickeyMouseBraveLittlePrince, {
        cost: { cost: "shift", shiftTarget },
      }).success,
    ).toBe(true);

    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [mickeyMouseBraveLittlePrince],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseBraveLittlePrince)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(shiftTarget)).toBe("discard");
    expect(testEngine.getCardsUnder(mickeyMouseBraveLittlePrince)).toHaveLength(0);
  });

  it("Universal Shift can target any character regardless of name or classification", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [baymaxGiantRobot],
      inkwell: 4,
      play: [dalmatianPuppyTailWagger],
    });

    const shiftTarget = testEngine.findCardInstanceId(dalmatianPuppyTailWagger, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(baymaxGiantRobot, {
        cost: { cost: "shift", shiftTarget },
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(baymaxGiantRobot)).toBe("play");
    expect(testEngine.getCardsUnder(baymaxGiantRobot)).toEqual([shiftTarget]);
  });

  it("Classification-based Shift can still enter exerted if an effect says it may", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [thunderboltWonderDog],
      inkwell: 3,
      play: [dalmatianPuppyTailWagger],
    });

    const shiftTarget = testEngine.findCardInstanceId(dalmatianPuppyTailWagger, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(thunderboltWonderDog, {
        cost: { cost: "shift", shiftTarget },
        resolveOptional: true,
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().isExerted(thunderboltWonderDog)).toBe(true);
  });

  it("Shifted character keeps the location state of the base character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [beastTragicHero],
      inkwell: 4,
      play: [beastForbiddingRecluse, hiddenCoveTranquilHaven],
    });

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(beastForbiddingRecluse, hiddenCoveTranquilHaven).success,
    ).toBe(true);

    const hiddenCoveId = String(testEngine.asPlayerOne().getCard(hiddenCoveTranquilHaven).id);
    expect(String(testEngine.asPlayerOne().getCardLocationId(beastForbiddingRecluse))).toBe(
      hiddenCoveId,
    );

    const shiftTarget = testEngine.findCardInstanceId(beastForbiddingRecluse, "play", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().playCard(beastTragicHero, {
        cost: { cost: "shift", shiftTarget },
      }).success,
    ).toBe(true);

    expect(String(testEngine.asPlayerOne().getCardLocationId(beastTragicHero))).toBe(hiddenCoveId);
    expect(testEngine.asPlayerOne().getCardLocationId(beastForbiddingRecluse)).toBe(undefined);
  });

  it("Cost reduction reduces shift's cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stitchRockStar, naniCaringSister, liloMakingAWish],
      inkwell: 3, // Stitch shift cost is 4
      play: [stitchNaughtyExperiment, plutoFriendlyPooch],
    });

    expect(testEngine.asPlayerOne().getCard(stitchRockStar).shiftInkCost).toBe(4);
    expect(testEngine.asPlayerOne().getCard(stitchRockStar).shiftPlayCost).toBe(4);
    const shiftTarget = testEngine.findCardInstanceId(stitchNaughtyExperiment, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(stitchRockStar, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toEqual(
      expect.objectContaining({
        success: false,
        errorCode: "INSUFFICIENT_INK",
      }),
    );

    expect(testEngine.asPlayerOne().activateAbility(plutoFriendlyPooch).success).toBe(true);
    expect(testEngine.asPlayerOne().getCard(stitchRockStar).shiftInkCost).toBe(4);
    expect(testEngine.asPlayerOne().getCard(stitchRockStar).shiftPlayCost).toBe(3);

    expect(
      testEngine.asPlayerOne().playCard(stitchRockStar, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toEqual(
      expect.objectContaining({
        success: true,
      }),
    );

    // Pluto's one-shot reduction was consumed by the Shift play, so Lilo stays at printed cost 1.
    expect(testEngine.asPlayerOne().getCard(liloMakingAWish).playCost).toBe(1);
    expect(testEngine.asPlayerOne().canPlayCard(liloMakingAWish)).toBe(false);

    expect(testEngine.asPlayerOne().ink(naniCaringSister).success).toBe(true);
    expect(testEngine.asPlayerOne().canPlayCard(liloMakingAWish)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(liloMakingAWish)).toBeSuccessfulCommand();
  });
});
