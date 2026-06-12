import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  dragonFire,
  fireTheCannons,
  mickeyMouseArtfulRogue,
  mickeyMouseTrueFriend,
  workTogether,
} from "@tcg/lorcana-cards/cards/001";
import {
  beastForbiddingRecluse,
  beastTragicHero,
  mickeyMouseFriendlyFace,
} from "@tcg/lorcana-cards/cards/002";
import { hiddenCoveTranquilHaven, mickeyMousePlayfulSorcerer } from "@tcg/lorcana-cards/cards/004";
import { baymaxGiantRobot, thunderboltWonderDog } from "@tcg/lorcana-cards/cards/007";
import { dalmatianPuppyTailWagger } from "@tcg/lorcana-cards/cards/008";
import { mickeyMouseBraveLittlePrince } from "@tcg/lorcana-cards/cards/009";
import { resolveOnlyBagEffect } from "./section-08-test-utils";

describe("#### 8. KEYWORDS", () => {
  describe("# 8.10. Shift", () => {
    it("8.10.2 / 8.10.4 / 8.10.6 / 8.10.7. Shift inherits exerted state, dry state, and damage, and a two-card stack leaves play together.", () => {
      // MickeyMouseBraveLittlePrince has base willpower 2 and gains +3 from CROWNING ACHIEVEMENT
      // while a card is under it (effective willpower = 5). We need total damage >= 5 to banish it.
      // Use mickeyMousePlayfulSorcerer (WP 4) as shift target with 3 damage — it survives (3 < 4).
      // After shifting, BraveLittlePrince inherits 3 damage; Fire the Cannons adds 2 more → total 5 >= 5.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mickeyMouseBraveLittlePrince, fireTheCannons],
        inkwell: 6,
        play: [{ card: mickeyMousePlayfulSorcerer, exerted: true, damage: 3 }],
      });

      const shiftTarget = testEngine.findCardInstanceId(
        mickeyMousePlayfulSorcerer,
        "play",
        PLAYER_ONE,
      );

      expect(
        testEngine.asPlayerOne().playCard(mickeyMouseBraveLittlePrince, {
          cost: { cost: "shift", shiftTarget },
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().isExerted(mickeyMouseBraveLittlePrince)).toBe(true);
      expect(testEngine.asPlayerOne().getCard(mickeyMouseBraveLittlePrince).drying).toBe(false);
      expect(testEngine.asPlayerOne().getDamage(mickeyMouseBraveLittlePrince)).toBe(3);
      expect(testEngine.getCardsUnder(mickeyMouseBraveLittlePrince)).toEqual([shiftTarget]);

      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, {
          targets: [mickeyMouseBraveLittlePrince],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseBraveLittlePrince)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(shiftTarget)).toBe("discard");
      expect(testEngine.getCardsUnder(mickeyMouseBraveLittlePrince)).toHaveLength(0);
    });

    it("8.10.4. A shifted character enters dry on a dry character and enters drying on a drying character.", () => {
      const dryEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mickeyMouseBraveLittlePrince],
        inkwell: 5,
        play: [mickeyMouseTrueFriend],
      });
      const dryShiftTarget = dryEngine.findCardInstanceId(
        mickeyMouseTrueFriend,
        "play",
        PLAYER_ONE,
      );

      expect(
        dryEngine.asPlayerOne().playCard(mickeyMouseBraveLittlePrince, {
          cost: { cost: "shift", shiftTarget: dryShiftTarget },
        }).success,
      ).toBe(true);
      expect(dryEngine.asPlayerOne().getCard(mickeyMouseBraveLittlePrince).drying).toBe(false);
      expect(dryEngine.asPlayerOne().quest(mickeyMouseBraveLittlePrince).success).toBe(true);
      expect(dryEngine.getLore(PLAYER_ONE)).toBe(mickeyMouseBraveLittlePrince.lore + 3);

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
      expect(dryingEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("8.10.5. A shifted character keeps effects that applied to the character it was placed on when it entered play.", () => {
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

    it("8.10.5. Only the top character in a shifted stack performs turn actions, and it uses the turn-action availability of the character underneath.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mickeyMousePlayfulSorcerer, mickeyMouseArtfulRogue],
        inkwell: 8,
        play: [mickeyMouseFriendlyFace],
      });

      const firstShiftTarget = testEngine.findCardInstanceId(
        mickeyMouseFriendlyFace,
        "play",
        PLAYER_ONE,
      );
      expect(
        testEngine.asPlayerOne().playCard(mickeyMousePlayfulSorcerer, {
          cost: { cost: "shift", shiftTarget: firstShiftTarget },
        }).success,
      ).toBe(true);

      const secondShiftTarget = testEngine.findCardInstanceId(
        mickeyMousePlayfulSorcerer,
        "play",
        PLAYER_ONE,
      );
      resolveOnlyBagEffect(testEngine, { targets: [secondShiftTarget] });
      expect(
        testEngine.asPlayerOne().playCard(mickeyMouseArtfulRogue, {
          cost: { cost: "shift", shiftTarget: secondShiftTarget },
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseFriendlyFace)).toBe("limbo");
      expect(testEngine.asPlayerOne().getCardZone(mickeyMousePlayfulSorcerer)).toBe("limbo");
      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseArtfulRogue)).toBe("play");

      expect(testEngine.asPlayerOne().quest(mickeyMouseArtfulRogue).success).toBe(true);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(mickeyMouseArtfulRogue.lore);
    });

    it("8.10.7. When the top card of a three-card shifted stack leaves play, every card in the stack goes to the same zone and stops being stacked.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mickeyMousePlayfulSorcerer, mickeyMouseArtfulRogue, dragonFire],
        inkwell: 13,
        play: [mickeyMouseFriendlyFace],
      });

      const firstShiftTarget = testEngine.findCardInstanceId(
        mickeyMouseFriendlyFace,
        "play",
        PLAYER_ONE,
      );
      expect(
        testEngine.asPlayerOne().playCard(mickeyMousePlayfulSorcerer, {
          cost: { cost: "shift", shiftTarget: firstShiftTarget },
        }).success,
      ).toBe(true);

      const secondShiftTarget = testEngine.findCardInstanceId(
        mickeyMousePlayfulSorcerer,
        "play",
        PLAYER_ONE,
      );
      resolveOnlyBagEffect(testEngine, { targets: [secondShiftTarget] });
      expect(
        testEngine.asPlayerOne().playCard(mickeyMouseArtfulRogue, {
          cost: { cost: "shift", shiftTarget: secondShiftTarget },
        }).success,
      ).toBe(true);
      expect(testEngine.getCardsUnder(mickeyMouseArtfulRogue)).toEqual([
        secondShiftTarget,
        firstShiftTarget,
      ]);

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [mickeyMouseArtfulRogue],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseFriendlyFace)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(mickeyMousePlayfulSorcerer)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseArtfulRogue)).toBe("discard");
      expect(testEngine.getCardsUnder(mickeyMouseArtfulRogue)).toHaveLength(0);
    });

    it("8.10.5. A shifted character keeps the location state of the character it was placed on.", () => {
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

      expect(String(testEngine.asPlayerOne().getCardLocationId(beastTragicHero))).toBe(
        hiddenCoveId,
      );
      expect(testEngine.asPlayerOne().getCardLocationId(beastForbiddingRecluse)).toBe(undefined);
    });

    it("8.10.3 / 8.10.8.1. A classification-based Shift can still enter exerted if an effect on the shifted character says it may.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [thunderboltWonderDog],
        inkwell: 3,
        play: [dalmatianPuppyTailWagger],
      });

      const shiftTarget = testEngine.findCardInstanceId(
        dalmatianPuppyTailWagger,
        "play",
        PLAYER_ONE,
      );

      expect(
        testEngine.asPlayerOne().playCard(thunderboltWonderDog, {
          cost: { cost: "shift", shiftTarget },
          resolveOptional: true,
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().isExerted(thunderboltWonderDog)).toBe(true);
    });

    it("8.10.8.2. Universal Shift can target any of your characters, even without a shared name or classification.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [baymaxGiantRobot],
        inkwell: 4,
        play: [dalmatianPuppyTailWagger],
      });

      const shiftTarget = testEngine.findCardInstanceId(
        dalmatianPuppyTailWagger,
        "play",
        PLAYER_ONE,
      );

      expect(
        testEngine.asPlayerOne().playCard(baymaxGiantRobot, {
          cost: { cost: "shift", shiftTarget },
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(baymaxGiantRobot)).toBe("play");
      expect(testEngine.getCardsUnder(baymaxGiantRobot)).toEqual([shiftTarget]);
    });
  });
});
