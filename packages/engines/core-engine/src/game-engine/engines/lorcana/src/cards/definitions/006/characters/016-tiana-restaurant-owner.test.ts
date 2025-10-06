/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arielSpectacularSinger,
  mickeyBraveLittleTailor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { friendsOnTheOtherSide } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import {
  madamMimFox,
  madamMimSnake,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { tianaRestaurantOwner } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tiana - Restaurant Owner", () => {
  describe("SPECIAL RESERVATION - Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.", () => {
    it("should apply the strength penalty if the player does not pay 3 {I}", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 1,
          play: [tianaRestaurantOwner, arielSpectacularSinger],
          hand: [mickeyBraveLittleTailor],
        },
        {
          inkwell: 3,
          play: [madamMimFox],
          hand: [],
          deck: [madamMimSnake, friendsOnTheOtherSide],
        },
      );

      await testEngine.tapCard(tianaRestaurantOwner);
      await testEngine.tapCard(arielSpectacularSinger);

      await testEngine.passTurn();

      await testEngine.challenge({
        attacker: madamMimFox,
        defender: arielSpectacularSinger,
      });

      await testEngine.skipTopOfStack();

      expect(testEngine.getCardModel(madamMimFox).strength).toBe(1);
    });
    it("should NOT apply the strength penalty if the player pays 3 {I}", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 1,
          play: [tianaRestaurantOwner, arielSpectacularSinger],
          hand: [mickeyBraveLittleTailor],
        },
        {
          inkwell: 3,
          play: [madamMimFox],
          hand: [],
          deck: [madamMimSnake, friendsOnTheOtherSide],
        },
      );

      await testEngine.tapCard(tianaRestaurantOwner);
      await testEngine.tapCard(arielSpectacularSinger);

      await testEngine.passTurn();

      await testEngine.challenge({
        attacker: madamMimFox,
        defender: arielSpectacularSinger,
      });

      await testEngine.acceptOptionalLayer();

      expect(testEngine.getCardModel(madamMimFox).strength).toBe(4);
      expect(testEngine.getAvailableInkwellCardCount("player_two")).toBe(0);
    });

    it("should apply the strength penalty if the player cannot pay the cost", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 1,
          play: [tianaRestaurantOwner, arielSpectacularSinger],
          hand: [mickeyBraveLittleTailor],
        },
        {
          inkwell: 1,
          play: [madamMimFox],
          hand: [],
          deck: [madamMimSnake, friendsOnTheOtherSide],
        },
      );

      await testEngine.tapCard(tianaRestaurantOwner);
      await testEngine.tapCard(arielSpectacularSinger);

      await testEngine.passTurn();

      await testEngine.challenge({
        attacker: madamMimFox,
        defender: arielSpectacularSinger,
      });

      await testEngine.acceptOptionalLayer();

      expect(testEngine.getCardModel(madamMimFox).strength).toBe(1);
      expect(testEngine.getAvailableInkwellCardCount("player_two")).toBe(1);
    });

    it("should not trigger if tiana is not exerted", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 1,
          play: [tianaRestaurantOwner, arielSpectacularSinger],
          hand: [mickeyBraveLittleTailor],
        },
        {
          inkwell: 1,
          play: [madamMimFox],
          hand: [],
          deck: [madamMimSnake, friendsOnTheOtherSide],
        },
      );

      await testEngine.tapCard(arielSpectacularSinger);

      await testEngine.passTurn();

      await testEngine.challenge({
        attacker: madamMimFox,
        defender: arielSpectacularSinger,
      });

      expect(testEngine.getCardModel(madamMimFox).strength).toBe(4);
      expect(testEngine.getAvailableInkwellCardCount("player_two")).toBe(1);
    });
  });
});
