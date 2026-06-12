import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import type { ZoneId } from "@tcg/lorcana-engine";
import { darkwingTowerIcyHeadquarters } from "../locations/204-darkwing-tower-icy-headquarters";
import { zootopiaTundratown } from "../locations/034-zootopia-tundratown";
import { launchpadHideoutDefender } from "./172-launchpad-hideout-defender";

describe("Launchpad - Hideout Defender", () => {
  describe("STAND GUARD — Your locations gain Resist +1.", () => {
    it("grants Resist +1 to your locations", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [launchpadHideoutDefender, zootopiaTundratown],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(zootopiaTundratown, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(zootopiaTundratown, "Resist")).toBe(1);
    });

    it("grants Resist +1 to multiple locations", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [launchpadHideoutDefender, zootopiaTundratown, darkwingTowerIcyHeadquarters],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(zootopiaTundratown, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(darkwingTowerIcyHeadquarters, "Resist")).toBe(
        true,
      );
    });

    it("does not grant Resist +1 to opponent's locations", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [launchpadHideoutDefender],
          deck: 2,
        },
        {
          play: [zootopiaTundratown],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerTwo().hasKeyword(zootopiaTundratown, "Resist")).toBe(false);
    });

    it("removes Resist +1 from locations when Launchpad leaves play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [launchpadHideoutDefender, zootopiaTundratown],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(zootopiaTundratown, "Resist")).toBe(true);

      const launchpadInstanceId = testEngine.findCardInstanceId(
        launchpadHideoutDefender,
        "play",
        PLAYER_ONE,
      );
      testEngine.asServer().manualMoveCard(launchpadInstanceId, `discard:${PLAYER_ONE}` as ZoneId);

      expect(testEngine.asPlayerOne().hasKeyword(zootopiaTundratown, "Resist")).toBe(false);
    });
  });
});
