import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { letItGo } from "./163-let-it-go";

describe("Let It Go (set 011)", () => {
  describe("Put chosen character into their player's inkwell facedown and exerted.", () => {
    it("puts a chosen opposing character into their player's inkwell facedown and exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [letItGo],
          inkwell: letItGo.cost,
        },
        {
          play: [simbaProtectiveCub],
        },
      );

      const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().playCard(letItGo, {
          targets: [simbaId],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerTwo().getCardZone(simbaId)).toBe("inkwell");
      expect(testEngine.asServer().getCard(simbaId)).toEqual(
        expect.objectContaining({ zone: "inkwell", exerted: true }),
      );
    });

    it("puts the card into inkwell facedown", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [letItGo],
          inkwell: letItGo.cost,
        },
        {
          play: [simbaProtectiveCub],
        },
      );

      const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().playCard(letItGo, {
          targets: [simbaId],
        }).success,
      ).toBe(true);

      expect(
        testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[simbaId]?.publicFaceState,
      ).toBe("faceDown");
    });

    it("puts a chosen own character into the controller's inkwell facedown and exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [letItGo],
        inkwell: letItGo.cost,
        play: [simbaProtectiveCub],
      });

      const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(letItGo, {
          targets: [simbaId],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(simbaId)).toBe("inkwell");
      expect(testEngine.asServer().getCard(simbaId)).toEqual(
        expect.objectContaining({ zone: "inkwell", exerted: true }),
      );
    });

    it("removes the character from play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [letItGo],
          inkwell: letItGo.cost,
        },
        {
          play: [simbaProtectiveCub],
        },
      );

      const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

      expect(testEngine.asPlayerTwo().getCardZone(simbaId)).toBe("play");

      expect(
        testEngine.asPlayerOne().playCard(letItGo, {
          targets: [simbaId],
        }).success,
      ).toBe(true);

      expect(testEngine.asPlayerTwo().getCardZone(simbaId)).not.toBe("play");
    });
  });
});
