/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  hesATramp,
  pepaMadrigalSensitiveSister,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Pepa Madrigal - Sensitive Sister", () => {
  describe("CLEAR SKIES, CLEAR SKIES Whenever one or more of your characters sings a song, gain 1 lore.", () => {
    it("Singing a song", async () => {
      const testEngine = new TestEngine({
        inkwell: pepaMadrigalSensitiveSister.cost,
        play: [pepaMadrigalSensitiveSister],
        hand: [hesATramp],
      });

      await testEngine.singSong({
        singer: pepaMadrigalSensitiveSister,
        song: hesATramp,
      });
      await testEngine.acceptOptionalLayer();

      expect(testEngine.getLoreForPlayer()).toBe(1);
    });

    it("Casting a song", async () => {
      const testEngine = new TestEngine({
        inkwell: pepaMadrigalSensitiveSister.cost,
        play: [pepaMadrigalSensitiveSister],
        hand: [hesATramp],
      });

      await testEngine.playCard(hesATramp);

      expect(testEngine.getLoreForPlayer()).toBe(0);
    });
  });
});
