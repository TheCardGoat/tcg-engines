import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { madDogKarnagesFirstMate } from "./093-mad-dog-karnages-first-mate";
import { donKarnageAirPirateLeader } from "./108-don-karnage-air-pirate-leader";

describe("Mad Dog - Karnage's First Mate", () => {
  describe("ARE YOU SURE THIS IS SAFE, CAPTAIN? - If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.", () => {
    it("can be played for 1 less ink when Don Karnage is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [madDogKarnagesFirstMate],
        play: [donKarnageAirPirateLeader],
        inkwell: madDogKarnagesFirstMate.cost - 1,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(madDogKarnagesFirstMate)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(madDogKarnagesFirstMate)).toBe("play");
    });

    it("cannot be played for less ink when Don Karnage is NOT in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [madDogKarnagesFirstMate],
        inkwell: madDogKarnagesFirstMate.cost - 1,
        deck: 2,
      });

      const result = testEngine.asPlayerOne().playCard(madDogKarnagesFirstMate);
      expect(result.success).toBe(false);
    });
  });
});
