/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  liloGalacticHero,
  mickeyBraveLittleTailor,
  mickeyMouseTrueFriend,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  agustinMadrigalClumsyDad,
  almaMadrigalFamilyMatriarch,
  mickeyMouseLeaderOfTheBand,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { heffalumpsAndWoozles } from "@lorcanito/lorcana-engine/cards/006";
import {
  theFamilyMadrigal,
  thisIsMyFamily,
} from "@lorcanito/lorcana-engine/cards/007";
import { downInNewOrleans } from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  dontLetTheFrostbiteBite,
  tryEverything,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { hesATramp } from "~/game-engine/engines/lorcana/src/cards/definitions/007/actions";

describe("The Family Madrigal", () => {
  describe("Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand.", () => {
    const deck = [
      liloGalacticHero,
      mickeyBraveLittleTailor,
      hesATramp,
      agustinMadrigalClumsyDad,
      almaMadrigalFamilyMatriarch,
      mickeyMouseTrueFriend,
      mickeyMouseLeaderOfTheBand,
    ];

    it("Happy Case", async () => {
      const testEngine = new TestEngine({
        inkwell: theFamilyMadrigal.cost,
        hand: [theFamilyMadrigal],
        deck: deck,
      });

      await testEngine.playCard(theFamilyMadrigal, {
        scry: {
          hand: [agustinMadrigalClumsyDad, hesATramp],
          top: [
            mickeyBraveLittleTailor,
            mickeyMouseTrueFriend,
            mickeyMouseLeaderOfTheBand,
          ],
        },
      });

      // Should have drawn both the Madrigal character and the song
      expect(testEngine.getCardModel(agustinMadrigalClumsyDad).zone).toBe(
        "hand",
      );
      expect(testEngine.getCardModel(hesATramp).zone).toBe("hand");
      // The rest should remain on top
      expect(testEngine.getCardModel(mickeyBraveLittleTailor).zone).toBe(
        "deck",
      );
    });

    it("Choosing only one potential target", async () => {
      const testEngine = new TestEngine({
        inkwell: theFamilyMadrigal.cost,
        hand: [theFamilyMadrigal],
        deck: deck,
      });

      await testEngine.playCard(theFamilyMadrigal, {
        scry: {
          hand: [agustinMadrigalClumsyDad],
          top: [
            mickeyBraveLittleTailor,
            mickeyMouseTrueFriend,
            mickeyMouseLeaderOfTheBand,
            hesATramp,
          ],
        },
      });

      expect(testEngine.getCardModel(agustinMadrigalClumsyDad).zone).toBe(
        "hand",
      );
      expect(testEngine.getCardModel(hesATramp).zone).toBe("deck");
    });

    it("Choosing one correct target and one incorrect", async () => {
      const testEngine = new TestEngine({
        inkwell: theFamilyMadrigal.cost,
        hand: [theFamilyMadrigal],
        deck: deck,
      });

      await testEngine.playCard(theFamilyMadrigal, {
        scry: {
          hand: [agustinMadrigalClumsyDad, mickeyBraveLittleTailor],
          top: [
            mickeyBraveLittleTailor,
            mickeyMouseTrueFriend,
            mickeyMouseLeaderOfTheBand,
            hesATramp,
          ],
        },
      });

      expect(testEngine.getCardModel(agustinMadrigalClumsyDad).zone).toBe(
        "hand",
      );
      expect(testEngine.getCardModel(mickeyBraveLittleTailor).zone).toBe(
        "deck",
      );
    });

    it("choosing 2 songs", async () => {
      const testEngine = new TestEngine({
        inkwell: theFamilyMadrigal.cost,
        hand: [theFamilyMadrigal],
        deck: [
          heffalumpsAndWoozles,
          thisIsMyFamily,
          tryEverything,
          downInNewOrleans,
          dontLetTheFrostbiteBite,
        ],
      });

      await testEngine.playCard(theFamilyMadrigal, {
        scry: {
          hand: [dontLetTheFrostbiteBite, downInNewOrleans],
          top: [heffalumpsAndWoozles, thisIsMyFamily, tryEverything],
        },
      });

      expect(testEngine.getCardModel(dontLetTheFrostbiteBite).zone).toBe(
        "hand",
      );
      expect(testEngine.getCardModel(downInNewOrleans).zone).toBe("deck");
    });

    it("Choosing more than they should", async () => {
      const testEngine = new TestEngine({
        inkwell: theFamilyMadrigal.cost,
        hand: [theFamilyMadrigal],
        deck: deck,
      });

      await testEngine.playCard(theFamilyMadrigal, {
        scry: {
          hand: [agustinMadrigalClumsyDad, almaMadrigalFamilyMatriarch],
          top: [
            mickeyBraveLittleTailor,
            mickeyMouseTrueFriend,
            mickeyMouseLeaderOfTheBand,
            hesATramp,
          ],
        },
      });

      expect(testEngine.getCardModel(agustinMadrigalClumsyDad).zone).toBe(
        "hand",
      );
      expect(testEngine.getCardModel(almaMadrigalFamilyMatriarch).zone).toBe(
        "deck",
      );
    });
  });
});
