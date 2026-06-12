import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import type { ZoneId } from "@tcg/lorcana-engine";
import { andysRoomHomeBase } from "../locations/034-andys-room-home-base";
import { pizzaPlanetSpaceport } from "../locations/102-pizza-planet-spaceport";
import { fatCatCriminalBusinessman } from "./187-fat-cat-criminal-businessman";

describe("Fat Cat - Criminal Businessman", () => {
  describe("WORTHY INVESTMENT — Your locations gain Resist +1.", () => {
    it("grants Resist +1 to your locations", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [fatCatCriminalBusinessman, andysRoomHomeBase],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(andysRoomHomeBase, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(andysRoomHomeBase, "Resist")).toBe(1);
    });

    it("grants Resist +1 to multiple locations", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [fatCatCriminalBusinessman, andysRoomHomeBase, pizzaPlanetSpaceport],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(andysRoomHomeBase, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(pizzaPlanetSpaceport, "Resist")).toBe(true);
    });

    it("does not grant Resist +1 to opponent's locations", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [fatCatCriminalBusinessman],
          deck: 2,
        },
        {
          play: [andysRoomHomeBase],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerTwo().hasKeyword(andysRoomHomeBase, "Resist")).toBe(false);
    });

    it("removes Resist +1 from locations when Fat Cat leaves play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [fatCatCriminalBusinessman, andysRoomHomeBase],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(andysRoomHomeBase, "Resist")).toBe(true);

      const fatCatInstanceId = testEngine.findCardInstanceId(
        fatCatCriminalBusinessman,
        "play",
        PLAYER_ONE,
      );
      testEngine.asServer().manualMoveCard(fatCatInstanceId, `discard:${PLAYER_ONE}` as ZoneId);

      expect(testEngine.asPlayerOne().hasKeyword(andysRoomHomeBase, "Resist")).toBe(false);
    });
  });
});
