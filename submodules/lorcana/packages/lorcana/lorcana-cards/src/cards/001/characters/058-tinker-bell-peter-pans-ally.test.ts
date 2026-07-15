import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { tinkerBellPeterPansAlly } from "./058-tinker-bell-peter-pans-ally";
import { peterPanFearlessFighter } from "./119-peter-pan-fearless-fighter";
import { peterPanNeverLanding } from "./091-peter-pan-never-landing";
import { peterPansShadowNotSewnOn } from "../../002/characters/055-peter-pans-shadow-not-sewn-on";

describe("Tinker Bell - Peter Pan's Ally", () => {
  it("has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [tinkerBellPeterPansAlly],
    });

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: tinkerBellPeterPansAlly,
      keyword: "Evasive",
    });
  });

  describe("LOYAL AND DEVOTED - Your characters named Peter Pan gain Challenger +1", () => {
    it("grants Challenger +1 to characters named Peter Pan", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tinkerBellPeterPansAlly, peterPanFearlessFighter, peterPanNeverLanding],
      });

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: peterPanFearlessFighter,
        keyword: "Challenger",
        value: 1,
      });

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: peterPanNeverLanding,
        keyword: "Challenger",
        value: 1,
      });
    });

    it("does NOT grant Challenger to characters not named exactly 'Peter Pan'", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tinkerBellPeterPansAlly, peterPansShadowNotSewnOn],
      });

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: peterPansShadowNotSewnOn,
        keyword: "Challenger",
      });
    });

    it("does NOT grant Challenger to Tinker Bell herself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tinkerBellPeterPansAlly],
      });

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: tinkerBellPeterPansAlly,
        keyword: "Challenger",
      });
    });
  });
});
